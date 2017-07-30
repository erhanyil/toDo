angular.module('starter',['starter.services'])

.run(function(Session,Rabbit) {
    Rabbit.run();
});

