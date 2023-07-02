import { User } from "@prisma/client";

export interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}
