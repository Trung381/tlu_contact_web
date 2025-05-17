import { useState } from 'react';
import { Button, Modal, Form, Upload, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';

const ModalCustom = ({ showModal, modal, loadingUploadPhoto }) => {
	const [file, setFile] = useState(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [isUpload, setIsUpload] = useState(false);

	const handleUploadChange = (info) => {
		if (info != null && info.file != null) {
			setFile(info.file);
		} else {
			setFile(null);
		}
	};

	const handleOk = async () => {
		setConfirmLoading(true);
		try {
			await modal?.onOk?.();
		} catch (error) {
			console.error(error);
		} finally {
			setConfirmLoading(false);
		}
	};

	const columns = [
		{
			title: '',
			dataIndex: 'content',
			render: (content) => content,
		},
	];

	const dataSource = [
		{
			key: '1',
			content: !isUpload ? modal?.formContent : (
				<Form
					layout="vertical"
					onFinish={() => modal?.onImport(file)} // Xử lý API cho upload file ở đây
				>
					<Form.Item label="Tải lên file" name="file" valuePropName="fileList"
						getValueFromEvent={(e) => e?.fileList}
						rules={[{ required: true, message: 'Vui lòng tải lên file!' }]}>
						<Upload listType="text" maxCount={1}
							showUploadList={false}
							beforeUpload={() => false}
							onChange={handleUploadChange}
						>
							{file ? (<Button>{file?.name}</Button>) : (<Button icon={<UploadOutlined />}>Tải file lên</Button>)}
						</Upload>
					</Form.Item>
				</Form>
			),
		},
	];

	return (
		<Modal
			title={modal?.title}
			open={showModal}
			onOk={handleOk}
			onCancel={modal?.onCancel}
			footer={modal?.footer}
			confirmLoading={confirmLoading}
			style={{ padding: 0 }}
		>
			<Table className='table-custom'
				size='small'
				cellPaddingBlock={0}
				loading={confirmLoading}
				columns={columns}
				dataSource={dataSource}
				pagination={false}
				scroll={{ y: '55vh' }}
				title={() => (
					modal?.isCreateForm && (
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								onClick={() => setIsUpload(false)}
								style={{
									marginRight: 4,
									backgroundColor: isUpload ? '' : '#60B5FF',
								}}
							><span style={{color: 'black'}}>Nhập dữ liệu</span></Button>
							<Button
								onClick={() => setIsUpload(true)}
								style={{
									backgroundColor: isUpload ? '#60B5FF' : '',
								}}
							><span style={{color: 'black'}}>Tải file lên</span></Button>
						</div>
					)
				)}
				style={{ padding: 0 }}
			/>
		</Modal>
	);
};

export default ModalCustom;