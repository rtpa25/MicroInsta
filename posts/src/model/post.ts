import { Model, Document, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
}

interface PostDoc extends Document {
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
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
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => {
    return new Post(attrs);
};

const Post = model<PostDoc, PostModel>('Post', postSchema);

export { Post };
