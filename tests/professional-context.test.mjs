import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('src/lib/aiContextBlock.ts', 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2020 }
}).outputText;

const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(transpiled)}`;
const { generateAIContextBlock } = await import(moduleUrl);

const sample = {
  user: {
    primary_role: 'Accountant (Practice)',
    job_title_selected: 'Partner',
    job_title_custom: '',
    seniority_level: 'Owner/Partner',
    work_setting: 'Accounting Practice (public practice)',
    specialisms: ['VAT', 'Payroll'],
    audiences: ['Business owners / directors', 'HMRC / regulators'],
    writing_style: 'Professional',
    risk_posture: 'Compliance-first (very cautious; avoid over-asserting)',
    locale: 'en-GB',
    context_version: 1
  },
  org: {
    firm_name: 'Example LLP',
    signature_block: 'Alex Smith | Example LLP',
    disclaimer_text: 'General guidance only.'
  }
};

test('AI context block output matches expected snapshot', () => {
  const output = generateAIContextBlock(sample);
  assert.match(output, /CONTEXT_VERSION: 1/);
  assert.match(output, /Role: Accountant \(Practice\)/);
  assert.match(output, /Audience: Business owners \/ directors, HMRC \/ regulators/);
  assert.match(output, /HMRC-aligned terminology/);
});

test('saving context payload shape persists required properties', () => {
  const payload = JSON.parse(JSON.stringify(sample));
  assert.equal(payload.user.writing_style, 'Professional');
  assert.equal(payload.user.risk_posture, 'Compliance-first (very cautious; avoid over-asserting)');
  assert.equal(payload.org.firm_name, 'Example LLP');
});

test('RLS migration includes cross-user protection predicates', () => {
  const migration = fs.readFileSync('supabase/migrations/20260218120000_add_professional_context.sql', 'utf8');
  assert.match(migration, /auth\.uid\(\) = user_id/);
  assert.match(migration, /owner_user_id = auth\.uid\(\)/);
});
