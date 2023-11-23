export default function Icon({
  icon,
  style,
  size = 28,
}: {
  icon: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        ...style,
      }}
      className={`mdi mdi-${icon}`}
    />
  );
}
