var app = angular
        .module('MaterialClock', ['ngMaterial'])
        .directive('mdTimePicker', function () {
            return {
                restrict: 'A',
                controller: function ($element) {
                    var radius = $element.prop('offsetWidth') / 2;
                    var parent = this;
                    var cssColor = $element.css('color');
                    var cssBorderColor = $element.css('border-color');
                    var stage = new createjs.Stage($element.attr('id'));
                    this.drawHours = function () {
                        var circle = new createjs.Shape();
                        circle.graphics.beginStroke(cssBorderColor).drawCircle(0, 0, radius * 0.9);
                        circle.x = radius;
                        circle.y = radius;
                        stage.addChild(circle);
                        for (var i = 1; i <= 12; i++) {
                            var text = new createjs.Text(i, radius * 0.1 + 'px sansserif', cssBorderColor);
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
                            stage.addChild(text);
                        }
                        for (var i = 13; i <= 24; i++) {
                            var text = new createjs.Text(i == 24 ? '00' : i, radius * 0.075 + 'px sansserif', cssBorderColor);
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
                            stage.addChild(text);
                        }
                        stage.update();
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

                    var hourCir = new createjs.Graphics().beginFill(cssColor).drawCircle(0, 0, radius * 0.08);
                    this.hour = new createjs.Shape(hourCir);
                    var hourTk = new createjs.Graphics().beginStroke(cssColor).moveTo(radius, radius).lineTo(0, radius * 0.9);
                    this.hourTick = new createjs.Shape(hourTk);

                    stage.addChild(this.hour);
                    stage.addChild(this.hourTick);
                    this.drawHours();
                    this.drawHour(0);
                }
            };
        });