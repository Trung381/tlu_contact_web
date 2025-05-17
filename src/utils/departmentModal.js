export const getDepartmentModal = (record, setShowModalView, setModal) => {
//   setShowModalView(true);
//   setModal({
//     title: `Thông tin đơn vị`,
//     formContent: (
//       <div className="space-y-4">
//         <div className="flex items-center space-x-4">
//           <Photo loadingUploadPhoto={loadingUploadPhoto} record={record} upload={uploadDepartmentPhoto} />
//           <div>
//             <h3 className="text-lg font-semibold">{record.name}</h3>
//             <p><span className="font-medium">Mã đơn vị: </span>{record.id}</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="font-medium">Email:</p>
//             <p>{record.email || "Chưa cập nhật"}</p>
//           </div>
//           <div>
//             <p className="font-medium">Số điện thoại:</p>
//             <p>{record.phone || "Chưa cập nhật"}</p>
//           </div>
//           <div className="col-span-2">
//             <p><span className="font-medium">Địa chỉ: </span>{record.address || "Chưa cập nhật"}</p>
//           </div>
//           <div className="col-span-2">
//             <p><span className="font-medium">Thuộc đơn vị: </span><ParentDepartment id={record.parentDepartmentId} /></p>
//           </div>
//           <div className="col-span-2">
//             <p className="font-medium">Đơn vị trực thuộc:</p>
//             <div className="ms-2 mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
//               <ChildDepartmentsList parentId={record.id} viewDetail={handleView} />
//             </div>
//           </div>
//         </div>
//       </div>
//     ),
//     footer: [
//       <Button key="edit" onClick={() => { setShowModalView(false); handleEdit(record) }}>Chỉnh sửa</Button>,
//       <Button key="close" onClick={() => setShowModalView(false)}>Đóng</Button>
//     ],
//     onCancel: () => setShowModalView(false),
//     onClose: () => setShowModalView(false)
//   });
};