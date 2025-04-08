import React, { useState } from 'react';
import { Button, Modal, Input, Form, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ModalCustom = ({ showModal, modal }) => {
	const [isFormData, setIsFormData] = useState(true);
	return (
		<>
			<Modal
				title={modal?.title}
				open={showModal}
				onOk={modal?.onOk}
				onCancel={modal?.onCancel}
				footer={modal?.footer}>
				{modal?.form ? (
					<div style={{ marginBottom: 16 }}>
						<Button type="button" onClick={() => setIsFormData(true)} style={{ marginRight: 8 }}>
							Nhập dữ liệu
						</Button>
						<Button type="button" onClick={() => setIsFormData(false)} >
							Tải lên file
						</Button>
					</div>
				) : null}
				{isFormData ? modal?.formContent : (
					<Form
						layout="vertical"
						onFinish={modal?.onOk} // Xử lý API cho upload file ở đây
					>
						<Form.Item label="Tải lên file" name="file" valuePropName="fileList"
							getValueFromEvent={(e) => e?.fileList}
							rules={[{ required: true, message: 'Vui lòng tải lên file!' }]}
						>
							<Upload action="/upload.do" listType="text" maxCount={1}
								showUploadList={false}
							><Button icon={<UploadOutlined />}>Tải file lên</Button>
							</Upload>
						</Form.Item>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default ModalCustom;