import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'

import List from './views/List/index'
import Upload from './views/Upload/index'
import ListForPlugin from './views/ListForPlugin/index'

class Routes extends React.Component {
	render() {
		return (
			<Switch>
				<Switch>
					<Route path="/list" component={(props)=><List {...props}/>} />
					<Route path="/upload" component={(props)=><Upload {...props}/>} />
					<Route path="/list-for-plugin" component={(props)=><ListForPlugin {...props}/>} />
					<Redirect to="/list" />
				</Switch>
			</Switch>
		)
	}
}
export default withRouter(hot(module)(Routes))
