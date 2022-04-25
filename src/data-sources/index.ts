import { App } from '@core/globals'

import UserDataSource from '@modules/user/data-source/user'
import RoleDataSource from '@modules/role/data-source/role'

export interface Datasources {
	User: UserDataSource
	Role: RoleDataSource
}

export default () => {
	return {
		User: new UserDataSource(App.Models.User),
		Role: new RoleDataSource(App.Models.Role),
	}
}
