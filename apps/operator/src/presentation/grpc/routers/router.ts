import { injectable } from 'tsyringe';
import type { IRPCRouter } from '../interfaces/router.interface';

@injectable()
export class RPCRouter implements IRPCRouter {
	constructor() {}

	public register(router: ConnectRouter): void {
		// Tag routes
		router.service(TagService, {
			getTags: (req, context) => this._tagController.getTags(req, context),
			getTagById: (req, context) => this._tagController.getTagById(req, context),
		});
	}
}
