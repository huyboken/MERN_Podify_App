import { Model, ObjectId, Schema, model, models } from "mongoose";

export type historyType = { audio: ObjectId; progress: number; date: Date };

export interface HistoryDocument {
  owner: ObjectId;
  last: historyType;
  all: historyType[];
}

const historySchema = new Schema<HistoryDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: Number,
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: Number,
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const History = models.History || model("History", historySchema);

export default History as Model<HistoryDocument>;
