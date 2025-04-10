import { Outlet } from 'react-router';
import { WorkspaceLayout } from './WorkspaceLayout';

const Workspace: React.FC = () => {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
};

export default Workspace;
