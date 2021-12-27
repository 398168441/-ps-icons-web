import {useState} from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'
import {Modal} from 'antd'

import TagList from '../../components/TagList'

const TagSelectModal = ({visible, close, selectedItems, loading, addTags, getTags}) => {
	const [tags, setTags] = useState([])

	const handleOk = async() => {
		await addTags({names: selectedItems, tags})
		// eslint-disable-next-line no-restricted-globals
		getTags({name})
		close()
	}
	const handleCancel = () => {
		close()
	}
	return (
		<Modal
			title="添加分类"
			visible={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okButtonProps={{
				loading,
				disabled: tags.length <= 0,
			}}
		>
			<TagList editable={true} value={tags} onChange={tags => setTags(tags)} />
		</Modal>
	)
}

export default connect(
	({ common }) => ({loading: common.loading}),
	{ ...actions },
)(TagSelectModal)
