import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalCustom = ({ title, showModal, onOk, onCancel, onClose, loading }) => {
	return (
		<>
			<Modal
				title={title}
				open={showModal}
				onOk={onOk}
				onCancel={onCancel}
				footer={
					[
						<Button key="cancle" onClick={onCancel}>
							Hủy
						</Button>,
						<Button key="submit" loading={loading} onClick={onOk}
							className='!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]'>
							Ok
						</Button>
					]
				}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</>
	);
};

export default ModalCustom;