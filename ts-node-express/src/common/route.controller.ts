import { Router } from 'express';

abstract class RouteContrller { constructor(public router: Router, protected path: string) { } }

export default RouteContrller;