import { Model, Document, Schema, model } from 'mongoose';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';

interface UserAttrs {
    username: string;
    email: string;
    password: string;
}

interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
    createJWT(user: UserDoc): string;
}

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
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
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

userSchema.statics.createJWT = (user: UserDoc) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        process.env.JWT_KEY!
    );
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };
