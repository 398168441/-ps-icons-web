import {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import AutoComplete from 'antd/lib/auto-complete'
import {Tag, Input} from 'antd'

import * as actions from '../../actions/index'
import './index.scss'

const filterOption = (inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

const TagList = ({getTags, name, editable, value = [], onChange, className, style}) => {
	const [tags, setTags] = useState([])
	const [inputVisible, setInputVisible] = useState(false)
	const [inputValue, setInputValue] = useState('')
	useEffect(() => {
		const loadTags = async() => {
			const tags = await getTags({name})
			setTags(tags)
		}
		loadTags()
	}, [])

	const handleInputConfirm = () => {
		if(inputValue && value.indexOf(inputValue) === -1) {
			onChange([...value, inputValue])
		}
		setInputValue('')
		setInputVisible(false)
	}

	const handleRemoveTag = (e, removeTag) => {
		e.preventDefault()
		onChange(value.filter(tag => tag !== removeTag))
	}
	const handleKeyDown = (e) => {
		if(e.key === 'Enter') {
			handleInputConfirm()
		}
	}
	return (
		<div className={`tag-list ${className || ''}`} style={style}>
			{value.map(tag => (
				<Tag key={tag} closable={editable} onClose={e => handleRemoveTag(e, tag)}>{tag}</Tag>
			))}
			{inputVisible && (
				<AutoComplete
					autoFocus={true}
					dataSource={tags}
					filterOption={filterOption}
					value={inputValue}
					onChange={value => setInputValue(value)}
				>
					<Input
						type="text"
						size="small"
						onBlur={handleInputConfirm}
						onKeyDown={handleKeyDown}
					/>
				</AutoComplete>
			)}
			{editable && !inputVisible && (
				<Tag className="tag-list__new" onClick={() => setInputVisible(true)}>
					{/* <Icon.AntIcon type="plus" /> 添加分类 */}
					添加分类
				</Tag>
			)}
		</div>
	)
}

export default connect(
	null,
	{ ...actions },
)(TagList)
