// Filename: src/pages/admin/comments/AdminManagementCommentPage.tsx (or your path)
"use client"; // If using Next.js App Router

import React, { useState } from 'react';
import AdminCommentReportsTable from '../../components/Admin/Table/AdminCommentReportTable';
import AdminCommentTableSection from '../../components/Admin/Table/AdminCommentTableSection';



const AdminManagementCommentPage: React.FC = () => {
  // This state will be used to link the "View Comment" action from AdminCommentReportsTable
  // to the global search filter of AdminCommentTableSection.
  const [adminCommentGlobalSearchTerm, setAdminCommentGlobalSearchTerm] = useState<string>("");

  return (
    <div className="admin-management-page grid"> {/* Use p-4 for overall padding */}
      <div className="col-12">
        <AdminCommentTableSection
          externalSearchTerm={adminCommentGlobalSearchTerm}
        />
      </div>

      <div className="col-12 mt-5"> {/* Added margin-top for clear separation */}
        <AdminCommentReportsTable
          setAdminCommentGlobalSearchTerm={setAdminCommentGlobalSearchTerm}
        />
      </div>
    </div>
  );
};

export default AdminManagementCommentPage;