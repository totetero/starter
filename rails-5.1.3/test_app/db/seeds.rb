# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

@user = User.new
@user.name = 'hoge1'
@user.username = 'hoge2'
@user.location = 'hoge3'
@user.about = 'hoge4'
@user.save

@user = User.new
@user.name = 'fuga1'
@user.username = 'fuga2'
@user.location = 'fuga3'
@user.about = 'fuga4'
@user.save

