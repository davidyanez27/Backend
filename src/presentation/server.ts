import express, { Router } from "express";
import cors from "cors";
import type { Express } from 'express';
import cookieParser from "cookie-parser";
import { notFoundErrrorMiddleware, prismaErrorMiddleware, zodErrorMiddleware, customErrorMiddleware, serverErrorMiddleware} from "./middlewares";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app: Express = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    
    //* Security middlewares
    this.app.use(cookieParser());
    
    // XSS Protection Headers
    this.app.use((req, res, next) => {
      // Prevent XSS attacks
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // Content Security Policy
      res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self'; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "media-src 'self'; " +
        "frame-src 'none';"
      );
      
      // Referrer Policy
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      next();
    });
    
    //* Middlewares
    this.app.use(express.json({ limit: '2mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '2mb' }));


    //* Routes
    this.app.use(this.routes);
    this.app.use(notFoundErrrorMiddleware);
    this.app.use(customErrorMiddleware);
    this.app.use(zodErrorMiddleware);
    this.app.use(prismaErrorMiddleware);
    this.app.use(serverErrorMiddleware);
    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
