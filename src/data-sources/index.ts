import { App } from '@core/globals'

import UserDataSource from '@modules/user/data-source/user'

export interface Datasources {
	User: UserDataSource
}

export default () => {
	return {
		User: new UserDataSource(App.Models.User),
	}
}
