var app = angular
        .module('MaterialClock', ['ngMaterial'])
        .directive('mdTimePicker', function () {
            return {
                restrict: 'E',
                scope: {
                    hour: '=?',
                    minute: '=?',
                    canvasId: '@'
                },
                template: '<div class="clock"><canvas id="clock-{{canvasId}}"></canvas></div>',
                controller: function ($element, $scope) {
                    var canvas = $element[0].childNodes[0].childNodes[0];
                    var radius = canvas.height;// / 2;
                    var parent = this;
                    var cssColor = $element.css('color');
                    var cssBorderColor = $element.css('border-color');
                    var stage = new createjs.Stage(canvas);//'clock-'+$scope.canvasId);
                    parent.hours = [];
                    parent.hours.length = 25;
                    parent.minutes = [];
                    parent.minutes.length = 13;
                    $scope.hour = '00';
                    $scope.minute = '00';
                    this.drawHours = function () {
                        parent.hours[0] = new createjs.Shape();
                        parent.hours[0].graphics.beginStroke(cssBorderColor).drawCircle(0, 0, radius * 0.9);
                        parent.hours[0].x = radius;
                        parent.hours[0].y = radius;
                        stage.addChild(parent.hours[0]);
                        for (var i = 1; i <= 12; i++) {
                            var text = new createjs.Text(i, radius * 0.1 + 'px sansserif', cssBorderColor);
                            var hit = new createjs.Shape();
                            hit.graphics.beginFill('#000').drawCircle(0, 0, radius * 0.1)
                            text.hitArea = hit;
                            var j = i;
                            text.addEventListener("click", function(event) {
                                $scope.$apply(function() {
                                    $scope.hour = event.currentTarget.text;
                                });
                                parent.drawHour($scope.hour);
                                parent.eraseHours();
                            });
                            var m2d = new createjs.Matrix2D();
                            m2d.identity()
                                    .translate(radius, radius)
                                    .rotate((i + 1.5) * 360 / 12)
                                    .translate(-radius * 0.75 / 2, -radius * 0.75 / 2)
                                    .rotate((-i - 1.5) * 360 / 12);
                            text.textBaseline = 'middle';
                            text.textAlign = 'center';
                            var d = m2d.decompose(text);
                            text.setTransform(d.x, d.y, d.scaleX, d.scaleY, d.rotation, d.skewX, d.skewY, d.regX, d.regY);
                            parent.hours[i] = text;
                            stage.addChild(text);
                        }
                        for (var i = 13; i <= 24; i++) {
                            var text = new createjs.Text(i == 24 ? '00' : i, radius * 0.075 + 'px sansserif', cssBorderColor);
                            var hit = new createjs.Shape();
                            hit.graphics.beginFill('#000').drawCircle(0, 0, radius * 0.075)
                            text.hitArea = hit;
                            var j = i;
                            text.addEventListener("click", function(event) {
                                $scope.$apply(function() {
                                    $scope.hour = event.currentTarget.text;
                                });
                                if ($scope.hour === '00')
                                    $scope.hour = '24';
                                parent.drawHour($scope.hour);
                                parent.eraseHours();
                            });
                            var m2d = new createjs.Matrix2D();
                            m2d.identity()
                                    .translate(radius, radius)
                                    .rotate((i + 1.5) * 360 / 12)
                                    .translate(-radius / 2, -radius / 2)
                                    .rotate((-i - 1.5) * 360 / 12);
                            text.textBaseline = 'middle';
                            text.textAlign = 'center';
                            var d = m2d.decompose(text);
                            text.setTransform(d.x, d.y, d.scaleX, d.scaleY, d.rotation, d.skewX, d.skewY, d.regX, d.regY);
                            parent.hours[i] = text;
                            stage.addChild(text);
                        }
                        stage.update();
                    };
                    this.eraseHours = function () {
                        for (var i = 0; i<parent.hours.length; i++) {
                            stage.removeChild(parent.hours[i]);
                        }
                        stage.removeChild(parent.hour);
                        stage.removeChild(parent.hourTick);
                        stage.addChild(parent.minute);
                        stage.addChild(parent.minuteTick);
                        stage.update();
                        parent.drawMinutes();
                        parent.drawMinute(0);
                    };
                    this.drawHour = function (i) {
                        i = i === 0 ? 24 : i;
                        var m2d = new createjs.Matrix2D();
                        m2d.identity()
                                .translate(radius, radius)
                                .rotate((i + 1.5) * 360 / 12)
                                .translate(-radius * (i <= 12 ? 0.75 : 1) / 2, -radius * (i <= 12 ? 0.75 : 1) / 2)
                                .rotate((-i - 1.5) * 360 / 12);
                        var d = m2d.decompose(parent.hour);
                        parent.hour.x = d.x;
                        parent.hour.y = d.y;
                        parent.hour.radius = radius * 0.9;
                        parent.hourTick.graphics.command.x = d.x;
                        parent.hourTick.graphics.command.y = d.y;
                        stage.update();
                    };
                    this.drawMinutes = function () {
                        parent.minutes[0] = new createjs.Shape();
                        parent.minutes[0].graphics.beginStroke(cssBorderColor).drawCircle(0, 0, radius * 0.9);
                        parent.minutes[0].x = radius;
                        parent.minutes[0].y = radius;
                        stage.addChild(parent.minutes[0]);
                        for (var i = 1; i <=12; i++) {
                            var text = new createjs.Text(i==12?'00':i*5, radius * 0.075 + 'px sansserif', cssBorderColor);
                            var hit = new createjs.Shape();
                            hit.graphics.beginFill('#000').drawCircle(0, 0, radius * 0.1)
                            text.hitArea = hit;
                            var j = i;
                            text.addEventListener("click", function(event) {
                                $scope.$apply(function() {
                                    $scope.minute = event.currentTarget.text;
                                });
                                parent.eraseHours();
                                parent.drawMinute($scope.minute);
                            });
                            var m2d = new createjs.Matrix2D();
                            m2d.identity()
                                    .translate(radius, radius)
                                    .rotate((i + 1.5) * 360 / 12)
                                    .translate(-radius / 2, -radius / 2)
                                    .rotate((-i - 1.5) * 360 / 12);
                            text.textBaseline = 'middle';
                            text.textAlign = 'center';
                            var d = m2d.decompose(text);
                            text.setTransform(d.x, d.y, d.scaleX, d.scaleY, d.rotation, d.skewX, d.skewY, d.regX, d.regY);
                            parent.minutes[i] = text;
                            stage.addChild(text);
                        }
                        stage.update();
                    };
                    this.drawMinute = function (i) {
                        i = i === 60 ? 0 : i;
                        var m2d = new createjs.Matrix2D();
                        m2d.identity()
                                .translate(radius, radius)
                                .rotate((i/5 + 1.5) * 360 / 12)
                                .translate(-radius / 2, -radius / 2)
                                .rotate((-i/5 - 1.5) * 360 / 12);
                        var d = m2d.decompose(parent.minute);
                        parent.minute.x = d.x;
                        parent.minute.y = d.y;
                        parent.minute.radius = radius * 0.9;
                        parent.minuteTick.graphics.command.x = d.x;
                        parent.minuteTick.graphics.command.y = d.y;
                        stage.update();
                    };

                    var hourCir = new createjs.Graphics().beginFill(cssColor).drawCircle(0, 0, radius * 0.08);
                    this.hour = new createjs.Shape(hourCir);
                    var hourTk = new createjs.Graphics().beginStroke(cssColor).moveTo(radius, radius).lineTo(0, radius * 0.9);
                    this.hourTick = new createjs.Shape(hourTk);

                    var minuteCir = new createjs.Graphics().beginFill(cssColor).drawCircle(0, 0, radius * 0.08);
                    this.minute = new createjs.Shape(minuteCir);
                    var minuteTk = new createjs.Graphics().beginStroke(cssColor).moveTo(radius, radius).lineTo(0, radius * 0.9);
                    this.minuteTick = new createjs.Shape(minuteTk);

                    stage.addChild(this.hour);
                    stage.addChild(this.hourTick);
                    this.drawHours();
                    this.drawHour(0);
                }
            };
        });