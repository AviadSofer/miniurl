import { FastifyRequest } from 'fastify'
import { InvalidConfigError } from '../../errors/invalidConfig'
import { BearerTokenAuth } from './drivers/bearerToken'
import type { BearerTokenDriverConfig } from './drivers/bearerToken/types'
import type { DriverConfig, Driver, AuthDriver, Scope } from './types'

export class Auth implements AuthDriver {
	private _driverName: Driver
	private _driver: AuthDriver
	constructor(driverName: Driver, driverConfig: DriverConfig) {
		this._driverName = driverName
		if (driverName === 'BearerToken') this._driver = new BearerTokenAuth(driverConfig as BearerTokenDriverConfig)
		else throw new InvalidConfigError('Invalid auth driver selected')
	}

	get driverName(): Driver {
		return this._driverName
	}

	get driver(): AuthDriver {
		return this._driver
	}

	public async isAuthorized(request: FastifyRequest): Promise<boolean> {
		return this._driver.isAuthorized(request)
	}
	public async allowedScopes(request: FastifyRequest): Promise<Scope[]> {
		return this._driver.allowedScopes(request)
	}
	public authorize(request: FastifyRequest): Promise<void> {
		return this._driver.authorize(request)
	}
}
