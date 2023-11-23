import Icon from "./Icon";

export function IconButton({
  icon,
  size = 20,
  onClick,
}: {
  icon: string;
  size?: number;
  onClick: () => void;
}) {
  return (
    <button className="icon-button" onClick={onClick}>
      <Icon icon={icon} size={size} />
    </button>
  );
}
