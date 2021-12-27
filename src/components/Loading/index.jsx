import { Spin, Icon } from 'antd'

import './index.scss'

const antIcon = <Icon type="loading" style={{ fontSize: '36px' }} spin />

export default () => (
	<button className="loading-container">
		<Spin indicator={antIcon} />
	</button>
)
