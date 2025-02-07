import { call, put, takeLatest } from 'redux-saga/effects';
import { REGISTER_REQUESTING, REGISTER_SUCCESS, REGISTER_UNSUCCESS, REGISTER_ERROR } from './constants';
import { SUCCESS_IN_REGISTER } from '../Login/constants';
import { apiHandle } from '../../helpers/apiHandle';
import { push } from 'react-router-redux';

function registerApi(Nombre, Email, Alias, IdTipoUsuario, Passwd) {
	const body = {
		Nombre: Nombre,
		Email: Email,
		Alias: Alias,
		IdTipoUsuario: IdTipoUsuario,
		Passwd: Passwd,
	};
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const endpoint = `http://10.0.21.47/tesis/api-jws/api/user/create_user.php`;

	const apiOptions = {
		body: body,
		config: config,
		endpoint: endpoint,
	};

	return apiHandle(apiOptions).post();
}

// This will be run when the REGISTER_REQUESTING
// Action is found by the watcher
function* registerFlow(action) {
	try {
		const { Nombre, Email, Alias, IdTipoUsuario, Passwd } = action;
		const response = yield call(registerApi, Nombre, Email, Alias, IdTipoUsuario, Passwd);
		if (response.data.message) {
			localStorage.clear();
			yield put({ type: REGISTER_SUCCESS, response });
			yield put({ type: SUCCESS_IN_REGISTER, response });
			yield put(push('/login'));
		} else {
			yield put({ type: REGISTER_UNSUCCESS, response });
		}
	} catch (error) {
		yield put({ type: REGISTER_ERROR, error });
	}
}

// Watches for the REGISTER_REQUESTING action type
// When it gets it, it will call registerFlow()
// WITH the action we dispatched
function* registerWatcher() {
	// takeLatest() takes the LATEST call of that action and runs it
	// if we we're to use takeEvery, it would take every single
	// one of the actions and kick off a new task to handle it
	// CONCURRENTLY!!!
	yield takeLatest(REGISTER_REQUESTING, registerFlow);
}

export default registerWatcher;
