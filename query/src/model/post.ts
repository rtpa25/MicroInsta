import { Model, Document, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
    id: string;
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
    likes: string[];
    numberOfComments: number;
}

interface PostDoc extends Document {
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
    likes: string[];
    numberOfComments: number;
    createdAt: string;
    updatedAt: string;
    version: number;
}

interface PostModel extends Model<PostDoc> {
    build(attrs: PostAttrs): PostDoc;
}

const postSchema = new Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: false,
        },
        userId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: String,
                required: false,
                default: [],
            },
        ],
        numberOfComments: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => {
    const post = new Post({
        _id: attrs.id,
        ...attrs,
    });
    delete post.id;
    return post;
};

const Post = model<PostDoc, PostModel>('Post', postSchema);

export { Post };
