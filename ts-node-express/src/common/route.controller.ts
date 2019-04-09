import { Router } from 'express';

abstract class RouteContrller { constructor(public router: Router, public path: string) { } }

export default RouteContrller;