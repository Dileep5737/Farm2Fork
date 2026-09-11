import React from 'react';
import { LoginPage } from './LoginPage';
import { Role, User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: Role;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

/**
 * Legacy modal wrapper redirecting to the new unified full-screen Farm2Fork LoginPage.
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'FARMER',
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <LoginPage
        initialRole={initialRole}
        onBackToHome={onClose}
        onSuccess={(user) => {
          onSuccess(user);
          onClose();
        }}
      />
    </div>
  );
};

export { LoginPage };
