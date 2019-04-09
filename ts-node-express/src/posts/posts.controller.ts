import * as express from 'express';
import Post from './post';
import RouteController from '../common/route.controller';

import postModel from './posts.model';
import HttpException from '../exceptions/http-exception';
import PostNotFoundException from '../exceptions/post-not-found-exception';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';

class PostsController extends RouteController {

    private post = postModel;

    constructor() {
        super(express.Router(), '/posts');
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.put(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = (request: express.Request, response: express.Response) => {
        this.post.find()
            .then((posts) => {
                response.send(posts);
            });
    }

    private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        this.post.findById(id)
            .then((post) => {
                if (post) {
                    response.send(post);
                } else {
                    next(new PostNotFoundException(id));
                }
            });
    }

    private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        console.log('update: ' + id);
        const postData: Post = request.body;
        this.post.findOneAndUpdate({ _id: id }, postData, { new: true })
            .then((post) => {
                if (post) {
                    response.send(post);
                } else {
                    next(new PostNotFoundException(id));
                }
            });
    }

    private createPost = (request: express.Request, response: express.Response) => {
        const postData: Post = request.body;
        const createdPost = new this.post(postData);
        createdPost.save()
            .then((savedPost) => {
                response.send(savedPost);
            });
    }

    private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        console.log('delete: ' + id);
        this.post.findOneAndDelete({ _id: id })
            .then((successResponse) => {
                if (successResponse) {
                    response.sendStatus(200);
                } else {
                    next(new PostNotFoundException(id));
                }
            });
    }
}

export default PostsController;