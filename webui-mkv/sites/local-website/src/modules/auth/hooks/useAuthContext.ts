import React from 'react';
import { AuthContext } from '../providers/auth-context';

export const useAuthContext = () => React.useContext(AuthContext);
