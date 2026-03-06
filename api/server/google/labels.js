async function syncGmailLabels(gmailClient, connectedAccountId, supabase) {
  const { data } = await gmailClient.users.labels.list({ userId: 'me' });
  const labels = data?.labels || [];

  if (labels.length > 0) {
    const upsertRows = labels.map((label) => ({
      connected_account_id: connectedAccountId,
      gmail_label_id: label.id,
      label_name: label.name,
      label_type: label.type || null,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('gmail_labels')
      .upsert(upsertRows, { onConflict: 'connected_account_id,gmail_label_id' });

    if (error) {
      throw error;
    }
  }

  const incomingLabelIds = new Set(
    labels
      .map((label) => label?.id)
      .filter((labelId) => typeof labelId === 'string' && labelId.length > 0)
  );

  const { data: existingRows, error: existingRowsError } = await supabase
    .from('gmail_labels')
    .select('gmail_label_id')
    .eq('connected_account_id', connectedAccountId);

  if (existingRowsError) {
    throw existingRowsError;
  }

  const staleLabelIds = (existingRows || [])
    .map((row) => row.gmail_label_id)
    .filter((gmailLabelId) => !incomingLabelIds.has(gmailLabelId));

  if (staleLabelIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('gmail_labels')
      .delete()
      .eq('connected_account_id', connectedAccountId)
      .in('gmail_label_id', staleLabelIds);

    if (deleteError) {
      throw deleteError;
    }
  }

  return labels;
}

async function ensureLabelExists(gmailClient, connectedAccountId, labelName, supabase) {
  const normalizedLabelName = String(labelName || '').trim();
  if (!normalizedLabelName) {
    throw new Error('labelName is required');
  }

  const { data: cachedLabel, error: cachedLabelError } = await supabase
    .from('gmail_labels')
    .select('gmail_label_id')
    .eq('connected_account_id', connectedAccountId)
    .eq('label_name', normalizedLabelName)
    .maybeSingle();

  if (cachedLabelError) {
    throw cachedLabelError;
  }

  if (cachedLabel?.gmail_label_id) {
    return cachedLabel.gmail_label_id;
  }

  const labels = await syncGmailLabels(gmailClient, connectedAccountId, supabase);
  const syncedLabel = labels.find((label) => label.name === normalizedLabelName);
  if (syncedLabel?.id) {
    return syncedLabel.id;
  }

  const created = await gmailClient.users.labels.create({
    userId: 'me',
    requestBody: {
      name: normalizedLabelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    }
  });

  const createdLabel = created?.data;
  if (!createdLabel?.id) {
    throw new Error('Failed to create label in Gmail');
  }

  const { error: insertError } = await supabase
    .from('gmail_labels')
    .insert({
      connected_account_id: connectedAccountId,
      gmail_label_id: createdLabel.id,
      label_name: createdLabel.name || normalizedLabelName,
      label_type: createdLabel.type || null
    });

  if (insertError) {
    throw insertError;
  }

  return createdLabel.id;
}

module.exports = {
  syncGmailLabels,
  ensureLabelExists
};
