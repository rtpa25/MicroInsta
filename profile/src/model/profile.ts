import { Model, Document, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProfileAttrs {
    username: string;
    userId: string;
    bio?: string | undefined;
    fullName?: string | undefined;
    avatarUrl?: string | undefined;
    friends: ProfileDoc[];
    friendRequests: ProfileDoc[];
}

interface ProfileDoc extends Document {
    username: string;
    userId: string;
    bio?: string | undefined;
    fullName?: string | undefined;
    avatarUrl?: string | undefined;
    friends: ProfileDoc[];
    friendRequests: ProfileDoc[];
    createdAt: string;
    updatedAt: string;
    version: number;
}

interface ProfileModel extends Model<ProfileDoc> {
    build(attrs: ProfileAttrs): ProfileDoc;
}

const profileSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        bio: {
            type: String,
            required: false,
        },
        fullName: {
            type: String,
            required: false,
        },
        avatarUrl: {
            type: String,
            required: false,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Profile',
                default: [],
            },
        ],
        friendRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Profile',
                default: [],
            },
        ],
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

profileSchema.set('versionKey', 'version');
profileSchema.plugin(updateIfCurrentPlugin);

profileSchema.statics.build = (attrs: ProfileAttrs) => {
    return new Profile(attrs);
};

const Profile = model<ProfileDoc, ProfileModel>('Profile', profileSchema);

export { Profile };
