const models = require( '../models' );
const mongoose = require( 'mongoose' );
const config = require( 'config' );
const encryption = require( '../utils/encryption' );

const movies = [
    { title: "Airplane", duration: 88, releaseDate: "1980-07-02" },
    { title: "The Hangover", duration: 100, releaseDate: "2009-06-05" },
    { title: "Wedding Crashers", duration: 119, releaseDate: "2005-07-15" },
    { title: "Die Hard", duration: 132, releaseDate: "1988-07-20" },
    { title: "The Terminator", duration: 107, releaseDate: "1984-10-26" },
    { title: "The Avengers", duration: 143, releaseDate: "2012-05-04" },
    { title: "The Notebook", duration: 123, releaseDate: "2004-06-25" },
    { title: "When Harry Met Sally", duration: 95, releaseDate: "1989-07-21" },
    { title: "Pretty Woman", duration: 119, releaseDate: "1990-03-23" },
    { title: "The Sixth Sense", duration: 107, releaseDate: "1999-08-06" },
    { title: "Gone Girl", duration: 149, releaseDate: "2014-10-03" },
    { title: "The Others", duration: 104, releaseDate: "2001-08-10" }
];

const adminUser = {
    username: 'admin',
    name: 'Administrator',
    password: 'admin',
    role: 'admin'
};

const user = {
    username: 'foo.bar',
    name: 'Foo Bar',
    password: 'foobar',
    role: 'user'
};

module.exports = async function () {
    await mongoose.connect( config.get( "db" ) );

    const { Movie, User } = models;

    await User.deleteMany( {} );
    adminUser.password = await encryption.generateHashedPassword( adminUser.password );
    await User.create( adminUser );

    user.password = await encryption.generateHashedPassword( user.password );
    const userRecord = await User.create( user );

    for ( const movie of movies ) {
        movie.userId = userRecord._id;
    }
    await Movie.deleteMany( {} );
    await Movie.insertMany( movies );

    await mongoose.disconnect();

    console.info( "Seeding done!" );
};
