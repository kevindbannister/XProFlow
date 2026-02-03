import { classNames } from '../../lib/utils';

type AvatarProps = {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
};

export const Avatar = ({ src, alt, fallback, className }: AvatarProps) => {
  return (
    <div
      className={classNames(
        'flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/20 text-xs font-semibold text-white',
        className
      )}
    >
      {src ? <img src={src} alt={alt ?? 'Avatar'} className="h-full w-full object-cover" /> : fallback}
    </div>
  );
};
