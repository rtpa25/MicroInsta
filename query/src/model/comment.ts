import { Model, Document, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CommentAttrs {
    id: string;
    content: string;
    postId: string;
    userId: string;
    username: string;
}

interface CommentDoc extends Document {
    content: string;
    postId: string;
    userId: string;
    username: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

interface CommentModel extends Model<CommentDoc> {
    build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
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

commentSchema.set('versionKey', 'version');
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (attrs: CommentAttrs) => {
    const comment = new Comment({
        _id: attrs.id,
        ...attrs,
    });
    delete comment.id;
    return comment;
};

const Comment = model<CommentDoc, CommentModel>('Comment', commentSchema);

export { Comment };
