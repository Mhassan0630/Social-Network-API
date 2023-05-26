const { User, Thought }= require('../models/index');
const connection = require('../config/connection');

const users = [
    {
        username: 'EmilySmith2023',
        email: 'emilysmith@example.com',
    },
    {
        username: 'JohnDoe_87',
        email: 'johndoe_87@example.com',
    },
    {
        username: 'SarahJohnson21',
        email: 'sarahjohnson21@example.com',
    },
    {
        username: 'DavidBrown34',
        email: 'davidbrown34@example.com',
    },
    {
        username: 'JessicaLee_99',
        email: 'jessicalee_99@example.com'
    }
];

connection.once('open', async () => {
    console.log('connected');

    try {
        await User.deleteMany({});

        await Thought.deleteMany({})

        console.log('All data was deleted!');

        for (let user of users) {
            let newUser = new User(user);
            await newUser.save();
            console.log(`Added user: ${user.username}`);
        }

        console.info('Seeding complete! 🌱');
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
