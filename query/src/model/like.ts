import { Model, Document, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface LikeAttrs {
    id: string;
    userId: string;
    postId: string;
}

interface LikeDoc extends Document {
    userId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
}

interface LikeModel extends Model<LikeDoc> {
    build(attrs: LikeAttrs): LikeDoc;
}

const likeSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
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

likeSchema.set('versionKey', 'version');
likeSchema.plugin(updateIfCurrentPlugin);

likeSchema.statics.build = (attrs: LikeAttrs) => {
    const like = new Like({
        _id: attrs.id,
        ...attrs,
    });
    delete like.id;
    return like;
};

const Like = model<LikeDoc, LikeModel>('Like', likeSchema);

export { Like };
