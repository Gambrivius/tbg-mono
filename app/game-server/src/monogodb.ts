import { connect } from 'mongoose';

async function connectMongo (): Promise<void> {
  if (!process.env.MONGO_CSTRING) return;
  await connect(process.env.MONGO_CSTRING);
}

export default connectMongo;