const fastify = require("fastify")();
const mongoose = require("mongoose");

async function initDb() {
  // if (mongoose.connections.readyState) {
  //   console.log("alredy connected");
  //   return;
  // }
  await mongoose
    .connect(
      "mongodb+srv://skumargurjar2002:VcajCjj8FMF00JVH@cluster0.hcb2i9n.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  // password: String,
});

const User = mongoose.model("User", UserSchema);

initDb();

fastify.register(require("@fastify/mongodb"), {
  forceClose: true,
  url: "mongodb+srv://skumargurjar2002:VcajCjj8FMF00JVH@cluster0.hcb2i9n.mongodb.net/?retryWrites=true&w=majority",
});

fastify.post("/users", async (request, reply) => {
  try {
    const { name, email } = request.body;

    const newUser = new User({ name, email });

    const savedUser = await newUser.save();

    reply.send(savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
    reply.status(500).send("Internal Server Error");
  }
});

fastify.get("/users", async (request, reply) => {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    reply.status(500).send("Internal Server Error");
  }
});

fastify.put("/users/:id", async (request, reply) => {
  try {
    const userId = request.params.id;
    console.log(userId);
    const { name, email } = request.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      reply.status(404).send("User not found");
    } else {
      reply.send(updatedUser);
    }
  } catch (err) {
    console.error("Error updating user:", err);
    reply.status(500).send("Internal Server Error");
  }
});

fastify.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
