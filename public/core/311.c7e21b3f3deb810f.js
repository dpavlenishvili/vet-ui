'use strict';
(self.webpackChunkvet = self.webpackChunkvet || []).push([
    [311],
    {
        5311: (et, x, c) => {
            c.r(x), c.d(x, { FeaturesRegistrationComponent: () => Xe });
            var e = c(5879),
                d = c(6814);
            const N = ['v-ui-button', ''],
                R = ['*'];
            let C = (() => {
                class t {
                    constructor() {
                        (this.color = 'primary'), (this.size = 'm');
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵcmp = e.Xpm({
                        type: t,
                        selectors: [['button', 'v-ui-button', '']],
                        hostVars: 12,
                        hostBindings: function (n, i) {
                            2 & n &&
                                e.ekj('v-ui-button', !0)('v-ui-button--primary', 'primary' === i.color)(
                                    'v-ui-button--secondary',
                                    'secondary' === i.color,
                                )('v-ui-button--small', 'sm' === i.size)('v-ui-button--medium', 'm' === i.size)(
                                    'v-ui-button--large',
                                    'l' === i.size,
                                );
                        },
                        inputs: { color: 'color', size: 'size' },
                        standalone: !0,
                        features: [e.jDz],
                        attrs: N,
                        ngContentSelectors: R,
                        decls: 1,
                        vars: 0,
                        template: function (n, i) {
                            1 & n && (e.F$t(), e.Hsn(0));
                        },
                        styles: [
                            '.v-ui-button{--btnBgColor: initial;--btnBorderRadius: 1rem;color:#fff;border:none;border-radius:1rem;transition:.3s ease;background-color:var(--btnBgColor);cursor:pointer;padding:var(--btnVerticalSpacing) var(--btnHorizontalSpacing);height:-moz-fit-content;height:fit-content}.v-ui-button:focus{--btnBorderRadius: .8rem;outline:none}.v-ui-button:disabled{--btnBgColor: #ececec;--btnBorderRadius: .8rem;cursor:not-allowed;pointer-events:none}.v-ui-button--primary{--btnBgColor: #4caee8}.v-ui-button--primary:hover{--btnBgColor: #89caf1}.v-ui-button--primary:active{--btnBgColor: #2895d7}.v-ui-button--primary:focus{--btnBgColor: #2895d7}.v-ui-button--secondary{--btnBgColor: #e0e0e0}.v-ui-button--secondary:hover,.v-ui-button--secondary:active,.v-ui-button--secondary:focus{--btnBgColor: #d1d1d1}.v-ui-button--small{--btnVerticalSpacing: .8rem;--btnHorizontalSpacing: 1rem}.v-ui-button--medium{--btnVerticalSpacing: 1rem;--btnHorizontalSpacing: 1.2rem}.v-ui-button--large{--btnVerticalSpacing: 1.6rem;--btnHorizontalSpacing: 1.8rem}\n',
                        ],
                        encapsulation: 2,
                        changeDetection: 0,
                    }));
                }
                return t;
            })();
            var h = c(1993),
                y = c(7328);
            let _ = (() => {
                class t {
                    constructor() {
                        (this.selected$ = new y.t(1)), (this.isDisabled$ = new y.t(1));
                    }
                    setRadioButtonValue(o) {
                        this.selected$.next(o);
                    }
                    setIsDisabled(o) {
                        this.isDisabled$.next(o);
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵprov = e.Yz7({ token: t, factory: t.ɵfac }));
                }
                return t;
            })();
            function M(t, a) {
                1 & t && e._UZ(0, 'div', 6);
            }
            const q = ['*'];
            let U = 0,
                J = (() => {
                    class t {
                        constructor(o, n) {
                            (this.cdr = o),
                                (this.radioButtonService = n),
                                (this.id = 'v-ui-radio-button-' + ++U),
                                (this.value = ''),
                                (this.name = ''),
                                (this.isDisabled = !1),
                                (this.checked = !1),
                                this.radioButtonService.selected$.pipe((0, h.sL)()).subscribe((i) => {
                                    (this.checked = this.value == i), this.cdr.markForCheck();
                                }),
                                this.radioButtonService.isDisabled$.pipe((0, h.sL)()).subscribe((i) => {
                                    (this.isDisabled = i), this.cdr.markForCheck();
                                });
                        }
                        onClick(o) {
                            o.stopPropagation(),
                                o.preventDefault(),
                                !this.isDisabled &&
                                    !this.checked &&
                                    this.radioButtonService.setRadioButtonValue(this.value);
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)(e.Y36(e.sBO), e.Y36(_));
                        });
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['v-ui-radio-button']],
                            hostBindings: function (n, i) {
                                1 & n &&
                                    e.NdJ('click', function (u) {
                                        return i.onClick(u);
                                    });
                            },
                            inputs: { id: 'id', value: 'value', name: 'name', isDisabled: 'isDisabled' },
                            standalone: !0,
                            features: [e.jDz],
                            ngContentSelectors: q,
                            decls: 7,
                            vars: 3,
                            consts: [
                                [1, 'radio-button-container'],
                                ['name', '', 'type', 'radio', 1, 'hidden-radio-button'],
                                ['aria-hidden', 'true', 1, 'radio-button'],
                                [1, 'radio-button-white-circle'],
                                ['class', 'radio-button-blue-circle', 4, 'ngIf'],
                                [1, 'radio-button-label'],
                                [1, 'radio-button-blue-circle'],
                            ],
                            template: function (n, i) {
                                1 & n &&
                                    (e.F$t(),
                                    e.TgZ(0, 'div', 0),
                                    e._UZ(1, 'input', 1),
                                    e.TgZ(2, 'div', 2)(3, 'div', 3),
                                    e.YNc(4, M, 1, 0, 'div', 4),
                                    e.qZA()(),
                                    e.TgZ(5, 'label', 5),
                                    e.Hsn(6),
                                    e.qZA()()),
                                    2 & n &&
                                        (e.xp6(1),
                                        e.uIk('id', i.id),
                                        e.xp6(3),
                                        e.Q6J('ngIf', i.checked),
                                        e.xp6(1),
                                        e.uIk('for', i.id));
                            },
                            dependencies: [d.ez, d.O5],
                            styles: [
                                '.radio-button-container[_ngcontent-%COMP%]{display:flex;align-items:center}.radio-button[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:2rem;height:2rem;border-radius:50%;background-color:#4caee8}.radio-button-white-circle[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:1.6rem;height:1.6rem;border-radius:50%;background-color:#fff;cursor:pointer}.radio-button-blue-circle[_ngcontent-%COMP%]{width:1.2rem;height:1.2rem;border-radius:50%;background-color:#4caee8}.radio-button-label[_ngcontent-%COMP%]{margin-left:1.4rem;color:#626262;cursor:pointer}.hidden-radio-button[_ngcontent-%COMP%]{position:absolute;opacity:0;z-index:-1}.hidden-radio-button[_ngcontent-%COMP%]:focus + .radio-button[_ngcontent-%COMP%]{background-color:#000}',
                            ],
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })();
            var s = c(6223);
            class b {}
            const G = ['*'];
            var w = (function (t) {
                return (t.HORIZONTAL = 'horizontal'), (t.VERTICAL = 'vertical'), t;
            })(w || {});
            let Q = 0,
                V = (() => {
                    class t extends b {
                        constructor() {
                            super(),
                                (this.id = 'v-ui-radio-button-group-' + ++Q),
                                (this.radioOrientation = w.HORIZONTAL),
                                (this.isDisabled = !1),
                                (this.ngControl = (0, e.f3M)(s.a5)),
                                (this._radioButtonService = (0, e.f3M)(_)),
                                (this.onChange = () => {}),
                                (this.onTouched = () => {}),
                                (this.ngControl.valueAccessor = this),
                                this._radioButtonService.selected$.pipe((0, h.sL)()).subscribe((o) => {
                                    this.onChange(o);
                                });
                        }
                        registerOnChange(o) {
                            this.onChange = o;
                        }
                        registerOnTouched(o) {
                            this.onTouched = o;
                        }
                        setDisabledState(o) {
                            (this.isDisabled = o), this._radioButtonService.setIsDisabled(this.isDisabled);
                        }
                        writeValue(o) {
                            o && this._radioButtonService.selected$.next(o);
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['v-ui-radio-button-group']],
                            hostVars: 4,
                            hostBindings: function (n, i) {
                                2 & n &&
                                    e.ekj('radio-button-wrapper-flex-row', 'horizontal' === i.radioOrientation)(
                                        'radio-button-wrapper-flex-column',
                                        'vertical' === i.radioOrientation,
                                    );
                            },
                            inputs: { id: 'id', radioOrientation: 'radioOrientation' },
                            standalone: !0,
                            features: [e._Bn([_, { provide: b, useExisting: (0, e.Gpc)(() => t) }]), e.qOj, e.jDz],
                            ngContentSelectors: G,
                            decls: 1,
                            vars: 0,
                            template: function (n, i) {
                                1 & n && (e.F$t(), e.Hsn(0));
                            },
                            styles: [
                                '.radio-button-wrapper-flex-row[_nghost-%COMP%]{display:flex;gap:4rem}.radio-button-wrapper-flex-column[_nghost-%COMP%]{display:flex;flex-direction:column;gap:1.6rem}',
                            ],
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })(),
                E = (() => {
                    class t {
                        isErrorState(o, n) {
                            return !!(o && o.invalid && (o.touched || (n && n.submitted)));
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵprov = e.Yz7({ token: t, factory: t.ɵfac, providedIn: 'root' }));
                    }
                    return t;
                })(),
                A = (() => {
                    class t {
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵdir = e.lG2({
                            type: t,
                            selectors: [['v-ui-form-item-label']],
                            standalone: !0,
                        }));
                    }
                    return t;
                })();
            function D(t) {
                return null != t && 'false' != `${t}`;
            }
            function H(t, a) {
                if ((1 & t && (e.TgZ(0, 'label', 5), e.Hsn(1, 1), e.qZA()), 2 & t)) {
                    const o = e.oxw();
                    e.Q6J('for', o.controlProvider.id);
                }
            }
            function Y(t, a) {
                1 & t && (e.ynx(0), e.Hsn(1, 2), e.BQk());
            }
            const W = ['*', [['v-ui-form-item-label']], [['v-ui-form-error']]],
                L = ['*', 'v-ui-form-item-label', 'v-ui-form-error'];
            let $ = (() => {
                class t {
                    constructor() {
                        (this.borderless = !1),
                            (this.clearBtn = !1),
                            (this.errorStateMatcher = (0, e.f3M)(E)),
                            (this.formGroupDirective = (0, e.f3M)(s.sg, { optional: !0 })),
                            (this.ngForm = (0, e.f3M)(s.F, { optional: !0 })),
                            (this.changeDetectorRef = (0, e.f3M)(e.sBO));
                    }
                    get disabled() {
                        return !!this.controlProvider.ngControl?.disabled;
                    }
                    get showError() {
                        if (this.controlProvider && this.controlProvider.ngControl) {
                            const o = this.errorStateMatcher.isErrorState(
                                this.controlProvider.ngControl.control,
                                this.formGroupDirective || this.ngForm || null,
                            );
                            return this.changeDetectorRef.markForCheck(), o;
                        }
                        return !1;
                    }
                    ngAfterViewInit() {
                        if (!this.controlProvider) throw new Error('No control provider found for form item');
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵcmp = e.Xpm({
                        type: t,
                        selectors: [['v-ui-form-item']],
                        contentQueries: function (n, i, r) {
                            if ((1 & n && (e.Suo(r, b, 5), e.Suo(r, A, 5)), 2 & n)) {
                                let u;
                                e.iGM((u = e.CRH())) && (i.controlProvider = u.first),
                                    e.iGM((u = e.CRH())) && (i.labelDirective = u.first);
                            }
                        },
                        hostVars: 6,
                        hostBindings: function (n, i) {
                            2 & n &&
                                e.ekj('v-ui-form-item', !0)('v-ui-form-item--disabled', i.disabled)(
                                    'v-ui-form-item--error',
                                    i.showError,
                                );
                        },
                        inputs: { borderless: ['borderless', 'borderless', D], clearBtn: ['clearBtn', 'clearBtn', D] },
                        standalone: !0,
                        features: [e.Xq5, e.jDz],
                        ngContentSelectors: L,
                        decls: 6,
                        vars: 7,
                        consts: [
                            ['class', 'v-ui-form-item__label', 3, 'for', 4, 'ngIf'],
                            [1, 'v-ui-form-item__control-container'],
                            ['type', 'button', 1, 'v-ui-form-item__clear-btn', 3, 'click'],
                            [1, 'v-ui-icon', 'cross'],
                            [4, 'ngIf'],
                            [1, 'v-ui-form-item__label', 3, 'for'],
                        ],
                        template: function (n, i) {
                            1 & n &&
                                (e.F$t(W),
                                e.YNc(0, H, 2, 1, 'label', 0),
                                e.TgZ(1, 'div', 1),
                                e.Hsn(2),
                                e.TgZ(3, 'button', 2),
                                e.NdJ('click', function (u) {
                                    return (
                                        u.stopPropagation(),
                                        null == i.controlProvider.ngControl ||
                                        null == i.controlProvider.ngControl.control
                                            ? null
                                            : i.controlProvider.ngControl.control.reset(null)
                                    );
                                }),
                                e._UZ(4, 'i', 3),
                                e.qZA()(),
                                e.YNc(5, Y, 2, 0, 'ng-container', 4)),
                                2 & n &&
                                    (e.Q6J('ngIf', i.labelDirective),
                                    e.xp6(1),
                                    e.ekj('v-ui-form-item__control-container--borderless', i.borderless),
                                    e.xp6(2),
                                    e.ekj(
                                        'v-ui-form-item__hide-clear-btn',
                                        !i.clearBtn ||
                                            !(
                                                null != i.controlProvider.ngControl &&
                                                null != i.controlProvider.ngControl.control &&
                                                i.controlProvider.ngControl.control.value
                                            ),
                                    ),
                                    e.uIk(
                                        'aria-hidden',
                                        !i.clearBtn ||
                                            !(
                                                null != i.controlProvider.ngControl &&
                                                null != i.controlProvider.ngControl.control &&
                                                i.controlProvider.ngControl.control.value
                                            ) ||
                                            null,
                                    ),
                                    e.xp6(2),
                                    e.Q6J('ngIf', i.showError));
                        },
                        dependencies: [d.O5],
                        styles: [
                            '.v-ui-form-item{display:flex;flex-direction:column;padding-bottom:2rem;position:relative}.v-ui-form-item .v-ui-form-item__hide-clear-btn{opacity:0;pointer-events:none}.v-ui-form-item .v-ui-form-item__clear-btn{border:none;outline:none;background-color:transparent;display:inline-flex;align-items:center;cursor:pointer}.v-ui-form-item .v-ui-form-item__clear-btn:focus{outline:.1rem solid var(--controlContainerBorderColor)}.v-ui-form-item .v-ui-form-item__label{margin-bottom:1.2rem;font-size:1.4rem;color:#636363;cursor:pointer}.v-ui-form-item .v-ui-form-item__control-container{--controlContainerBorderColor: #c8c8c8;display:flex;flex-direction:row;width:100%;padding:1.3rem 1.2rem;border:.1rem solid var(--controlContainerBorderColor);border-radius:1rem;background-color:transparent}.v-ui-form-item .v-ui-form-item__control-container--borderless{border:none}.v-ui-form-item .v-ui-form-item__control-container:focus-within{--controlContainerBorderColor: #4caee8}.v-ui-form-item--disabled .v-ui-form-item__label{color:#c5c5c5}.v-ui-form-item--error .v-ui-form-item__control-container,.v-ui-form-item--error .v-ui-form-item__control-container:focus-within{--controlContainerBorderColor: #ee4f64}.v-ui-form-item--error .v-ui-form-item__clear-btn{color:var(--controlContainerBorderColor)}.v-ui-form-item--error v-ui-form-error{display:none}.v-ui-form-item--error v-ui-form-error:first-of-type{display:inline-flex;position:absolute;bottom:.4rem;left:0}\n',
                        ],
                        encapsulation: 2,
                        changeDetection: 0,
                    }));
                }
                return t;
            })();
            const K = ['*'];
            let X = (() => {
                class t {
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵcmp = e.Xpm({
                        type: t,
                        selectors: [['v-ui-form-error']],
                        hostVars: 2,
                        hostBindings: function (n, i) {
                            2 & n && e.ekj('error-message', !0);
                        },
                        standalone: !0,
                        features: [e.jDz],
                        ngContentSelectors: K,
                        decls: 1,
                        vars: 0,
                        template: function (n, i) {
                            1 & n && (e.F$t(), e.Hsn(0));
                        },
                        styles: ['.error-message[_nghost-%COMP%]{display:flex;gap:.5rem;font-size:1rem;color:#ee4f64}'],
                        changeDetection: 0,
                    }));
                }
                return t;
            })();
            const ee = ['v-ui-input', ''];
            let te = 0,
                T = (() => {
                    class t extends b {
                        constructor() {
                            super(...arguments),
                                (this.id = 'v-ui-input-' + ++te),
                                (this.placeholder = ''),
                                (this.type = 'text'),
                                (this.isDisabled = !1),
                                (this.value = ''),
                                (this.ngControl = (0, e.f3M)(s.a5, { optional: !0 }));
                        }
                        static #e = (this.ɵfac = (function () {
                            let o;
                            return function (i) {
                                return (o || (o = e.n5z(t)))(i || t);
                            };
                        })());
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['input', 'v-ui-input', '']],
                            hostVars: 5,
                            hostBindings: function (n, i) {
                                2 & n &&
                                    (e.uIk('disabled', i.isDisabled || null)('aria-disabled', i.isDisabled || null)(
                                        'id',
                                        i.id,
                                    ),
                                    e.ekj('v-ui-input', !0));
                            },
                            inputs: { id: 'id', placeholder: 'placeholder', type: 'type' },
                            standalone: !0,
                            features: [e._Bn([{ provide: b, useExisting: (0, e.Gpc)(() => t) }]), e.qOj, e.jDz],
                            attrs: ee,
                            decls: 0,
                            vars: 0,
                            template: function (n, i) {},
                            styles: [
                                '.v-ui-input{font-size:1.2rem;color:#636363;outline:none;background-color:transparent;border:none;display:flex;flex-grow:1}.v-ui-input ::placeholder{color:#757575;opacity:1}.v-ui-input ::-ms-input-placeholder{color:#757575}.v-ui-input:disabled{border:.1rem solid #f6f6f6}\n',
                            ],
                            encapsulation: 2,
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })();
            var v = c(8637);
            let oe = (() => {
                class t {
                    constructor(o) {
                        this.translocoService = o;
                    }
                    transform(o) {
                        if (o) {
                            const i = Object.keys(o)[0];
                            let r = null,
                                u = null;
                            return (
                                (r = o[i]?.requiredLength),
                                (u = o[i]?.actualLength),
                                this.translocoService.translate(`errors.${i}`, { requiredLength: r, actualLength: u })
                            );
                        }
                        return null;
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)(e.Y36(v.Vn, 16));
                    });
                    static #t = (this.ɵpipe = e.Yjl({
                        name: 'validationErrorPipe',
                        type: t,
                        pure: !1,
                        standalone: !0,
                    }));
                }
                return t;
            })();
            var B = c(1848);
            class z {
                setChecked(a) {
                    a !== this.checked &&
                        ((this.checked = a),
                        this.checkedChange.emit(a),
                        this.checkboxGroup && this.checkboxGroup.checkboxCheckedChange(this, !!a));
                }
            }
            class ne {}
            const ie = function () {
                    return { 'width.px': 90 };
                },
                re = ['*'];
            let ae = 0,
                se = (() => {
                    class t extends z {
                        constructor() {
                            super(),
                                (this.id = 'v-ui-checkbox-' + ++ae),
                                (this.checked = !1),
                                (this.disabled = !1),
                                (this.checkedChange = new e.vpe()),
                                (this.ngControl = (0, e.f3M)(s.a5, { optional: !0, self: !0 })),
                                (this.checkboxGroup = (0, e.f3M)(ne, { optional: !0 })),
                                (this.changeDetectorRef = (0, e.f3M)(e.sBO)),
                                (this.onChange = () => {}),
                                (this.onTouched = () => {}),
                                this.ngControl && (this.ngControl.valueAccessor = this);
                        }
                        registerOnChange(o) {
                            this.onChange = o;
                        }
                        registerOnTouched(o) {
                            this.onTouched = o;
                        }
                        setDisabledState(o) {
                            this.disabled = o;
                        }
                        writeValue(o) {
                            (this.checked = null === o ? null : o), this.changeDetectorRef.detectChanges();
                        }
                        checkChange(o) {
                            this.onTouched(), this.setChecked(o), this.onChange(o);
                        }
                        ngAfterViewInit() {
                            this.checkboxGroup &&
                                ((this.checked = this.checkboxGroup.value.includes(this.value)),
                                this.changeDetectorRef.detectChanges());
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['v-ui-checkbox']],
                            inputs: {
                                id: 'id',
                                value: 'value',
                                checked: 'checked',
                                disabled: ['disabled', 'disabled', D],
                            },
                            outputs: { checkedChange: 'checkedChange' },
                            standalone: !0,
                            features: [
                                e._Bn([
                                    { provide: z, useExisting: (0, e.Gpc)(() => t) },
                                    { provide: b, useExisting: (0, e.Gpc)(() => t) },
                                ]),
                                e.Xq5,
                                e.qOj,
                                e.jDz,
                            ],
                            ngContentSelectors: re,
                            decls: 8,
                            vars: 6,
                            consts: [
                                ['type', 'checkbox', 1, 'checkbox-input', 3, 'indeterminate', 'change'],
                                ['checkboxInput', ''],
                                [1, 'checkbox-label'],
                                ['aria-hidden', 'true', 1, 'checkbox'],
                                ['src', 'assets/icons/check.svg', 3, 'svgStyle'],
                                [1, 'indeterminate-state'],
                                [1, 'checkbox-label-text'],
                            ],
                            template: function (n, i) {
                                if (1 & n) {
                                    const r = e.EpF();
                                    e.F$t(),
                                        e.TgZ(0, 'input', 0, 1),
                                        e.NdJ('change', function () {
                                            e.CHM(r);
                                            const l = e.MAs(1);
                                            return e.KtG(i.checkChange(l.checked));
                                        }),
                                        e.qZA(),
                                        e.TgZ(2, 'label', 2)(3, 'div', 3),
                                        e._UZ(4, 'svg-icon', 4)(5, 'div', 5),
                                        e.qZA(),
                                        e.TgZ(6, 'span', 6),
                                        e.Hsn(7),
                                        e.qZA()();
                                }
                                2 & n &&
                                    (e.Q6J('indeterminate', null === i.checked),
                                    e.uIk('checked', i.checked || null)('id', i.id),
                                    e.xp6(2),
                                    e.uIk('for', i.id),
                                    e.xp6(2),
                                    e.Q6J('svgStyle', e.DdM(5, ie)));
                            },
                            dependencies: [B.bk],
                            styles: [
                                '.checkbox-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1.2rem;width:-moz-fit-content;width:fit-content;cursor:pointer}.checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;transition:background-color .3s;width:1.6rem;height:1.6rem;border:.1rem solid #4caee8;border-radius:.2rem}.checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]   svg-icon[_ngcontent-%COMP%]{display:none}.checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]   .indeterminate-state[_ngcontent-%COMP%]{display:none;width:1rem;height:1rem;background-color:#4caee8}.checkbox-input[_ngcontent-%COMP%]{position:absolute;opacity:0;z-index:-1}.checkbox-input[_ngcontent-%COMP%]:focus + .checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]{background-color:#000;outline:.1rem solid #4caee8}.checkbox-input[_ngcontent-%COMP%]:checked + .checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]   svg-icon[_ngcontent-%COMP%]{display:initial}.checkbox-input[_ngcontent-%COMP%]:indeterminate + .checkbox-label[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]   .indeterminate-state[_ngcontent-%COMP%]{display:initial}',
                            ],
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })();
            class f {}
            var g = c(7921),
                ue = c(7398);
            function ce(t, a) {
                if ((1 & t && (e.ynx(0), e.TgZ(1, 'span', 6), e._uU(2), e.qZA(), e._uU(3), e.BQk()), 2 & t)) {
                    const o = e.oxw(),
                        n = o.$implicit,
                        i = o.index,
                        r = e.oxw();
                    e.xp6(1),
                        e.ekj('v-ui-wizard__list-item-index-active', n === r.activeStep()),
                        e.xp6(1),
                        e.hij(' ', i + 1, ' '),
                        e.xp6(1),
                        e.hij(' ', n.title, ' ');
                }
            }
            function le(t, a) {}
            const de = function (t, a) {
                return { active: t, index: a };
            };
            function pe(t, a) {
                if ((1 & t && (e.ynx(0), e.YNc(1, le, 0, 0, 'ng-template', 7), e.BQk()), 2 & t)) {
                    const o = e.oxw(),
                        n = o.$implicit,
                        i = o.index;
                    e.xp6(1),
                        e.Q6J('ngTemplateOutlet', n.titleTemplateRef)(
                            'ngTemplateOutletContext',
                            e.WLB(2, de, n.active, i),
                        );
                }
            }
            function be(t, a) {
                1 & t && e._UZ(0, 'li', 8);
            }
            function me(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.ynx(0),
                        e.TgZ(1, 'li', 4),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).$implicit,
                                u = e.oxw();
                            return e.KtG(u.activateItem(r.id));
                        }),
                        e.YNc(2, ce, 4, 4, 'ng-container', 3),
                        e.YNc(3, pe, 2, 5, 'ng-container', 3),
                        e.qZA(),
                        e.YNc(4, be, 1, 0, 'li', 5),
                        e.BQk();
                }
                if (2 & t) {
                    const o = a.$implicit,
                        n = a.last;
                    e.xp6(1),
                        e.ekj('v-ui-wizard__list-item--active', o.active)(
                            'v-ui-wizard__list-item--disabled',
                            o.disabled,
                        ),
                        e.xp6(1),
                        e.Q6J('ngIf', o.title),
                        e.xp6(1),
                        e.Q6J('ngIf', o.titleTemplateRef),
                        e.xp6(1),
                        e.Q6J('ngIf', !n);
                }
            }
            function he(t, a) {}
            function fe(t, a) {}
            function ge(t, a) {
                if (
                    (1 & t &&
                        (e.ynx(0),
                        e.TgZ(1, 'div', 9),
                        e.YNc(2, he, 0, 0, 'ng-template', 7),
                        e.qZA(),
                        e.TgZ(3, 'div', 10),
                        e.YNc(4, fe, 0, 0, 'ng-template', 7),
                        e.qZA(),
                        e.BQk()),
                    2 & t)
                ) {
                    const o = a.ngIf,
                        n = e.oxw();
                    e.xp6(2),
                        e.Q6J('ngTemplateOutlet', o.templateRef)('ngTemplateOutletContext', n.stepContext(o)),
                        e.xp6(2),
                        e.Q6J('ngTemplateOutlet', o.footerTemplateRef)('ngTemplateOutletContext', n.footerContext(o));
                }
            }
            let _e = (() => {
                    class t {
                        constructor() {
                            (this.horizontal = !1),
                                (this.activeStep = (0, e.tdS)(null)),
                                (this._cdr = (0, e.f3M)(e.sBO)),
                                (this.activateItem = this.activateItem.bind(this)),
                                (this.next = this.next.bind(this)),
                                (this.previous = this.previous.bind(this));
                        }
                        ngAfterViewInit() {
                            this.steps.changes
                                .pipe(
                                    (0, g.O)(this.steps),
                                    (0, ue.U)((o) => o.toArray()),
                                )
                                .subscribe((o) => {
                                    const n = o.map((u) => u.id),
                                        i = new Set(n);
                                    n.length !== i.size && console.warn('Wizard steps should have unique ids');
                                    const r = o.find((u) => u.active);
                                    this.activateItem(r ? r.id : o[0].id), this._cdr.detectChanges();
                                });
                        }
                        activateItem(o) {
                            const n = this.activeStep(),
                                i = this.steps.toArray().findIndex(({ id: m }) => m === n?.id),
                                r = this.steps.toArray().findIndex(({ id: m }) => m === o),
                                u = r > i,
                                l = this.steps.get(r);
                            let p;
                            (p = !n || (u ? n.isValid() : l && !l.disabled && l.isValid())),
                                p &&
                                    (this.steps.forEach((m) => (m.active = !1)),
                                    (l.active = !0),
                                    this.activeStep.set(l),
                                    n && n.deactivated.emit(),
                                    l.activated.emit());
                        }
                        next() {
                            const o = this.steps.toArray().findIndex(({ id: n }) => n === this.activeStep()?.id);
                            if (-1 !== o && this.activeStep()?.isValid()) {
                                const n = this.steps.toArray()[o + 1];
                                n && this.activateItem(n.id);
                            }
                        }
                        previous() {
                            const o = this.steps.toArray().findIndex(({ id: n }) => n === this.activeStep()?.id);
                            if (-1 !== o) {
                                const n = this.steps.toArray()[o - 1];
                                n && this.activateItem(n.id);
                            }
                        }
                        stepContext(o) {
                            return { ...o, goTo: this.activateItem, next: this.next, previous: this.previous };
                        }
                        footerContext(o) {
                            return { ...o, goTo: this.activateItem, next: this.next, previous: this.previous };
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['v-ui-wizard']],
                            contentQueries: function (n, i, r) {
                                if ((1 & n && e.Suo(r, f, 4), 2 & n)) {
                                    let u;
                                    e.iGM((u = e.CRH())) && (i.steps = u);
                                }
                            },
                            hostVars: 4,
                            hostBindings: function (n, i) {
                                2 & n && e.ekj('v-ui-wizard', !0)('v-ui-wizard--horizontal', i.horizontal);
                            },
                            inputs: { horizontal: 'horizontal' },
                            standalone: !0,
                            features: [e.jDz],
                            decls: 4,
                            vars: 2,
                            consts: [
                                [1, 'v-ui-wizard__list'],
                                [4, 'ngFor', 'ngForOf'],
                                [1, 'v-ui-wizard__step'],
                                [4, 'ngIf'],
                                ['role', 'link', 1, 'v-ui-wizard__list-item', 3, 'click'],
                                ['class', 'v-ui-wizard__list-item-separator', 'aria-hidden', 'true', 4, 'ngIf'],
                                ['role', 'presentation', 1, 'v-ui-wizard__list-item-index'],
                                [3, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
                                ['aria-hidden', 'true', 1, 'v-ui-wizard__list-item-separator'],
                                [1, 'v-ui-wizard__step-content'],
                                [1, 'v-ui-wizard__step-footer'],
                            ],
                            template: function (n, i) {
                                1 & n &&
                                    (e.TgZ(0, 'ul', 0),
                                    e.YNc(1, me, 5, 7, 'ng-container', 1),
                                    e.qZA(),
                                    e.TgZ(2, 'section', 2),
                                    e.YNc(3, ge, 5, 4, 'ng-container', 3),
                                    e.qZA()),
                                    2 & n &&
                                        (e.xp6(1), e.Q6J('ngForOf', i.steps), e.xp6(2), e.Q6J('ngIf', i.activeStep()));
                            },
                            dependencies: [d.ez, d.sg, d.O5, d.tP],
                            styles: [
                                '.v-ui-wizard{display:flex;flex-direction:column;gap:2rem;padding:2rem;align-items:flex-start}.v-ui-wizard--horizontal{flex-direction:row}.v-ui-wizard .v-ui-wizard__step{display:flex;flex-direction:column;flex-grow:1;padding:1.7rem;border-radius:2rem;background-color:#fff}.v-ui-wizard .v-ui-wizard__step .v-ui-wizard__step-content{display:flex;flex-direction:column;flex-grow:1}.v-ui-wizard .v-ui-wizard__list{display:flex;flex-direction:column;list-style:none;padding:1.7rem;border-radius:2rem;background-color:#fff}.v-ui-wizard .v-ui-wizard__list-item-separator{height:7rem;display:flex;padding:.7rem 0 .7rem 1rem}.v-ui-wizard .v-ui-wizard__list-item-separator:before{display:block;content:"";height:100%;border-radius:.15rem;width:.3rem;background-color:var(--separatorColor, #4caee8)}.v-ui-wizard .v-ui-wizard__list-item{--indexBorderColor: #4carr8;--indexBackgroundColor: #4caee8;--itemTextColor: #4caee8;min-height:3rem;display:flex;align-items:center;cursor:pointer;color:var(--itemTextColor)}.v-ui-wizard .v-ui-wizard__list-item-index{display:flex;margin-right:1rem;width:2.4rem;height:2.4rem;border:.3rem solid var(--indexBorderColor);background-color:var(--indexBackgroundColor);color:#fff;align-items:center;justify-content:space-around;border-radius:50%}.v-ui-wizard .v-ui-wizard__list-item-index-active{width:3rem;height:3rem;margin-left:-.25rem}.v-ui-wizard .v-ui-wizard__list-item--active~.v-ui-wizard__list-item{--indexBorderColor: transparent;--indexBackgroundColor: #b1b7bb;--itemTextColor: #757575}.v-ui-wizard .v-ui-wizard__list-item--active+.v-ui-wizard__list-item-separator~.v-ui-wizard__list-item-separator{--separatorColor: #b1b7bb}.v-ui-wizard__compressed{width:25px}\n',
                            ],
                            encapsulation: 2,
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })(),
                Z = (() => {
                    class t {
                        constructor(o) {
                            this.templateRef = o;
                        }
                        static ngTemplateContextGuard(o, n) {
                            return !0;
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)(e.Y36(e.Rgc));
                        });
                        static #t = (this.ɵdir = e.lG2({
                            type: t,
                            selectors: [['', 'vUiWizardStepContent', '']],
                            standalone: !0,
                        }));
                    }
                    return t;
                })(),
                F = (() => {
                    class t {
                        constructor(o, n) {
                            (this.templateRef = o), (this.viewContainerRef = n);
                        }
                        static ngTemplateContextGuard(o, n) {
                            return !0;
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)(e.Y36(e.Rgc), e.Y36(e.s_b));
                        });
                        static #t = (this.ɵdir = e.lG2({
                            type: t,
                            selectors: [['', 'vUiWizardStepFooter', '']],
                            standalone: !0,
                        }));
                    }
                    return t;
                })();
            const De = ['contentTemplate'],
                ve = ['footerTemplate'];
            function ke(t, a) {
                1 & t && e.Hsn(0);
            }
            function xe(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 2)(1, 'button', 3),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).previous;
                            return e.KtG(r());
                        }),
                        e._uU(2),
                        e.qZA(),
                        e.TgZ(3, 'button', 4),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).next;
                            return e.KtG(r());
                        }),
                        e._uU(4),
                        e.qZA()();
                }
                if (2 & t) {
                    const o = e.oxw();
                    e.xp6(2), e.Oqu(o.secondaryButtonTitle), e.xp6(2), e.Oqu(o.primaryButtonTitle);
                }
            }
            const Ce = ['*'];
            let ye = (() => {
                    class t extends f {
                        constructor() {
                            super(...arguments),
                                (this.active = !1),
                                (this.disabled = !1),
                                (this.title = ''),
                                (this.primaryButtonTitle = 'Next'),
                                (this.secondaryButtonTitle = 'Previous'),
                                (this.activated = new e.vpe()),
                                (this.deactivated = new e.vpe()),
                                (this.isValid = (0, e.tdS)(!0));
                        }
                        get templateRef() {
                            return this._contentDirective ? this._contentDirective.templateRef : this._templateRef;
                        }
                        get footerTemplateRef() {
                            return this._footerDirective ? this._footerDirective.templateRef : this._footerTemplateRef;
                        }
                        static #e = (this.ɵfac = (function () {
                            let o;
                            return function (i) {
                                return (o || (o = e.n5z(t)))(i || t);
                            };
                        })());
                        static #t = (this.ɵcmp = e.Xpm({
                            type: t,
                            selectors: [['v-ui-wizard-step']],
                            contentQueries: function (n, i, r) {
                                if ((1 & n && (e.Suo(r, Z, 5), e.Suo(r, F, 5)), 2 & n)) {
                                    let u;
                                    e.iGM((u = e.CRH())) && (i._contentDirective = u.first),
                                        e.iGM((u = e.CRH())) && (i._footerDirective = u.first);
                                }
                            },
                            viewQuery: function (n, i) {
                                if ((1 & n && (e.Gf(De, 5), e.Gf(ve, 5)), 2 & n)) {
                                    let r;
                                    e.iGM((r = e.CRH())) && (i._templateRef = r.first),
                                        e.iGM((r = e.CRH())) && (i._footerTemplateRef = r.first);
                                }
                            },
                            inputs: {
                                id: 'id',
                                active: 'active',
                                disabled: 'disabled',
                                title: 'title',
                                primaryButtonTitle: 'primaryButtonTitle',
                                secondaryButtonTitle: 'secondaryButtonTitle',
                            },
                            outputs: { activated: 'activated', deactivated: 'deactivated' },
                            standalone: !0,
                            features: [e._Bn([{ provide: f, useExisting: t }]), e.qOj, e.jDz],
                            ngContentSelectors: Ce,
                            decls: 4,
                            vars: 0,
                            consts: [
                                ['contentTemplate', ''],
                                ['footerTemplate', ''],
                                [1, 'v-ui-wizard-step__footer'],
                                ['v-ui-button', '', 'color', 'secondary', 3, 'click'],
                                ['v-ui-button', '', 3, 'click'],
                            ],
                            template: function (n, i) {
                                1 & n &&
                                    (e.F$t(),
                                    e.YNc(0, ke, 1, 0, 'ng-template', null, 0, e.W1O),
                                    e.YNc(2, xe, 5, 2, 'ng-template', null, 1, e.W1O));
                            },
                            dependencies: [d.ez, C],
                            styles: [
                                '.v-ui-wizard-step__step-container{overflow:hidden;white-space:nowrap;cursor:pointer}.v-ui-wizard-step__step-number{display:inline-block;width:2.4rem;height:2.4rem;margin-right:1.4rem;background-color:#b1b7bb;color:#fff;border-radius:50%;font-size:1.4rem;font-weight:500}.v-ui-wizard-step__step-number span{display:flex;justify-content:center;align-items:center;width:2.4rem;height:2.4rem}.v-ui-wizard-step__step-name{font-size:1.4rem;color:#757575;list-style:none}.v-ui-wizard-step__vertical-line{display:inline-block;height:4rem;margin:1rem;border:solid 2px #b1b7bb;border-radius:1rem}.v-ui-wizard-step__background-active{background-color:#4caee8}.v-ui-wizard-step__border-active{border:solid 2px #4caee8}.v-ui-wizard-step__color-active{color:#4caee8}\n',
                            ],
                            encapsulation: 2,
                            changeDetection: 0,
                        }));
                    }
                    return t;
                })(),
                we = (() => {
                    class t {
                        constructor() {
                            (this.wizardStep = (0, e.f3M)(f)),
                                (this._formGroup = (0, e.f3M)(s.sg, { optional: !0 })),
                                (this._formGroupName = (0, e.f3M)(s.x0, { optional: !0 })),
                                (this._ngForm = (0, e.f3M)(s.F, { optional: !0 })),
                                (this.destroyRef = (0, e.f3M)(e.ktI)),
                                (this._cdr = (0, e.f3M)(e.sBO));
                        }
                        ngAfterViewInit() {
                            this._formGroupName?.statusChanges
                                ?.pipe((0, g.O)(null), (0, h.sL)(this.destroyRef))
                                .subscribe(() => {
                                    this.wizardStep.isValid.set(!!this._formGroupName?.valid),
                                        this._cdr.detectChanges();
                                }),
                                !this._formGroupName &&
                                    this._formGroup?.statusChanges
                                        ?.pipe((0, g.O)(null), (0, h.sL)(this.destroyRef))
                                        .subscribe(() => {
                                            this.wizardStep.isValid.set(!!this._formGroup?.valid),
                                                this._cdr.detectChanges();
                                        }),
                                this._ngForm?.statusChanges
                                    ?.pipe((0, g.O)(null), (0, h.sL)(this.destroyRef))
                                    .subscribe(() => {
                                        this.wizardStep.isValid.set(!!this._formGroup?.valid),
                                            this._cdr.detectChanges();
                                    });
                        }
                        static #e = (this.ɵfac = function (n) {
                            return new (n || t)();
                        });
                        static #t = (this.ɵdir = e.lG2({
                            type: t,
                            selectors: [['', 'vUiWizardStepControlContent', '']],
                            standalone: !0,
                        }));
                    }
                    return t;
                })();
            var k = c(8513),
                Ee = c(1835),
                Ae = c(5812);
            let Te = (() => {
                class t {
                    static forRoot() {
                        return { ngModule: t, providers: [Ee.oj, Ae.sA] };
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵmod = e.oAB({ type: t }));
                    static #o = (this.ɵinj = e.cJS({ imports: [d.ez] }));
                }
                return t;
            })();
            var Be = c(2389);
            const ze = function (t) {
                return { dateInputFormat: t, showWeekNumbers: !1, containerClass: 'theme-blue' };
            };
            let Ze = 0;
            function I(t, a) {
                if (void 0 !== t) return 'string' == typeof t ? (0, Be.sG)(t, a) : t;
            }
            let Fe = (() => {
                class t extends b {
                    set minDate(o) {
                        this._minDate = I(o, this.format);
                    }
                    set maxDate(o) {
                        this._maxDate = I(o, this.format);
                    }
                    constructor() {
                        super(),
                            (this.id = 'v-ui-datepicker-' + ++Ze),
                            (this.format = 'DD/MM/YYYY'),
                            (this.valueChange = new e.vpe()),
                            (this.ngControl = (0, e.f3M)(s.a5, { optional: !0 })),
                            (this.disabled = !1),
                            (this._changeDetectorRef = (0, e.f3M)(e.sBO)),
                            (this.onChange = (o) => this.valueChange.emit(o)),
                            (this.onTouched = Function.prototype),
                            this.ngControl && (this.ngControl.valueAccessor = this);
                    }
                    writeValue(o) {
                        console.log({ obj: o }), (this.value = o), this._changeDetectorRef.detectChanges();
                    }
                    registerOnChange(o) {
                        this.onChange = (n) => {
                            this.valueChange.emit(n), o(n);
                        };
                    }
                    registerOnTouched(o) {
                        this.onTouched = o;
                    }
                    setDisabledState(o) {
                        this.disabled = o;
                    }
                    onDateChange(o) {
                        (this.value = o), this.onChange(o), this.onTouched();
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵcmp = e.Xpm({
                        type: t,
                        selectors: [['v-ui-datepicker']],
                        inputs: {
                            id: 'id',
                            format: 'format',
                            placeholder: 'placeholder',
                            value: 'value',
                            minDate: 'minDate',
                            maxDate: 'maxDate',
                        },
                        outputs: { valueChange: 'valueChange' },
                        standalone: !0,
                        features: [e._Bn([{ provide: b, useExisting: t }]), e.qOj, e.jDz],
                        decls: 1,
                        vars: 10,
                        consts: [
                            [
                                'v-ui-input',
                                '',
                                'type',
                                'text',
                                'container',
                                'body',
                                'placement',
                                'bottom',
                                'autocomplete',
                                'off',
                                'bsDatepicker',
                                '',
                                3,
                                'placeholder',
                                'ngModel',
                                'minDate',
                                'maxDate',
                                'id',
                                'bsConfig',
                                'outsideClick',
                                'disabled',
                                'ngModelChange',
                            ],
                        ],
                        template: function (n, i) {
                            1 & n &&
                                (e.TgZ(0, 'input', 0),
                                e.NdJ('ngModelChange', function (u) {
                                    return i.onDateChange(u);
                                }),
                                e.qZA()),
                                2 & n &&
                                    e.Q6J('placeholder', i.placeholder || i.format)('ngModel', i.value)(
                                        'minDate',
                                        i._minDate,
                                    )('maxDate', i._maxDate)('id', i.id)('bsConfig', e.VKq(8, ze, i.format))(
                                        'outsideClick',
                                        !0,
                                    )('disabled', i.disabled);
                        },
                        dependencies: [k.kn, k.Np, k.Y5, T, Te, s.u5, s.Fj, s.JJ, s.On],
                        styles: [
                            '.bs-datepicker{display:flex;align-items:stretch;flex-flow:row wrap;background:#fff;box-shadow:0 0 10px #aaa;position:relative;z-index:1}.bs-datepicker:after{clear:both;content:"";display:block}.bs-datepicker bs-day-picker{float:left}.bs-datepicker button:hover,.bs-datepicker button:focus,.bs-datepicker button:active,.bs-datepicker input:hover,.bs-datepicker input:focus,.bs-datepicker input:active,.bs-datepicker-btns button:hover,.bs-datepicker-btns button:focus,.bs-datepicker-btns button:active,.bs-datepicker-predefined-btns button:active,.bs-datepicker-predefined-btns button:focus{outline:none}.bs-datepicker-head{min-width:270px;height:50px;padding:10px;border-radius:3px 3px 0 0;text-align:justify}.bs-datepicker-head:after{content:"";display:inline-block;vertical-align:top;width:100%}.bs-datepicker-head button{display:inline-block;vertical-align:top;padding:0;height:30px;line-height:30px;border:0;background:transparent;text-align:center;cursor:pointer;color:#fff;transition:.3s}.bs-datepicker-head button[disabled],.bs-datepicker-head button[disabled]:hover,.bs-datepicker-head button[disabled]:active{background:rgba(221,221,221,.3);color:#f5f5f5;cursor:not-allowed}.bs-datepicker-head button.previous span{transform:translate(-1px,-1px)}.bs-datepicker-head button.next span{transform:translate(1px,-1px)}.bs-datepicker-head button.next,.bs-datepicker-head button.previous{border-radius:50%;width:30px;height:30px}.bs-datepicker-head button.next span,.bs-datepicker-head button.previous span{font-size:28px;line-height:1;display:inline-block;position:relative;height:100%;width:100%;border-radius:50%}.bs-datepicker-head button.current{border-radius:15px;max-width:155px;padding:0 13px}.bs-datepicker-head button:hover{background-color:#0000001a}.bs-datepicker-head button:active{background-color:#0003}.bs-datepicker-body{padding:10px;border-radius:0 0 3px 3px;min-height:232px;min-width:278px;border:1px solid #e9edf0}.bs-datepicker-body .days.weeks{position:relative;z-index:1}.bs-datepicker-body table{width:100%;border-collapse:separate;border-spacing:0}.bs-datepicker-body table th{font-size:13px;color:#9aaec1;font-weight:400;text-align:center}.bs-datepicker-body table td{color:#54708b;text-align:center;position:relative;padding:0}.bs-datepicker-body table td span{display:block;margin:0 auto;font-size:13px;border-radius:50%;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}.bs-datepicker-body table td:not(.disabled):not(.week) span:not(.disabled):not(.is-other-month){cursor:pointer}.bs-datepicker-body table td.is-highlighted:not(.disabled):not(.selected) span,.bs-datepicker-body table td span.is-highlighted:not(.disabled):not(.selected){background-color:#e9edf0;transition:0s}.bs-datepicker-body table td.is-active-other-month:not(.disabled):not(.selected) span,.bs-datepicker-body table td span.is-active-other-month:not(.disabled):not(.selected){background-color:#e9edf0;transition:0s;cursor:pointer}.bs-datepicker-body table td span.disabled,.bs-datepicker-body table td.disabled span{color:#9aaec1}.bs-datepicker-body table td span.selected,.bs-datepicker-body table td.selected span{color:#fff}.bs-datepicker-body table td span.selected.disabled,.bs-datepicker-body table td.selected.disabled span{opacity:.3}.bs-datepicker-body table td span.is-other-month,.bs-datepicker-body table td.is-other-month span{color:#00000040}.bs-datepicker-body table td.active{position:relative}.bs-datepicker-body table td.active.select-start:before{left:35%}.bs-datepicker-body table td.active.select-end:before{left:-85%}.bs-datepicker-body table td span.active.select-start:after,.bs-datepicker-body table td span.active.select-end:after,.bs-datepicker-body table td.active.select-start span:after,.bs-datepicker-body table td.active.select-end span:after{content:"";display:block;position:absolute;z-index:-1;width:100%;height:100%;transition:.3s;top:0;border-radius:50%}.bs-datepicker-body table td:before,.bs-datepicker-body table td span:before{content:"";display:block;position:absolute;z-index:-1;inset:6px -2px 6px -3px;box-sizing:content-box;background:transparent}.bs-datepicker-body table td.active.select-start+td.active:before{left:-20%}.bs-datepicker-body table td:last-child.active:before{border-radius:0 3px 3px 0;width:125%;left:-25%}.bs-datepicker-body table td span[class*=select-],.bs-datepicker-body table td[class*=select-] span{border-radius:50%;color:#fff}.bs-datepicker-body table.days td.active:not(.select-start):not(.disabled):before,.bs-datepicker-body table.days td.in-range:not(.select-start):not(.disabled):before,.bs-datepicker-body table.days span.active:not(.select-start):not(.disabled):before,.bs-datepicker-body table.days span.in-range:not(.select-start):not(.disabled):before{background:#e9edf0}.bs-datepicker-body table.days span{width:32px;height:32px;line-height:32px}.bs-datepicker-body table.days span.select-start{z-index:2}.bs-datepicker-body table.days span.is-highlighted.in-range:before{right:3px;left:0}.bs-datepicker-body table.days span.in-range.select-end:before{right:4px;left:0}.bs-datepicker-body table.days td.select-start+td.select-end:before,.bs-datepicker-body table.days td.select-start+td.is-highlighted:before,.bs-datepicker-body table.days td.active+td.is-highlighted:before,.bs-datepicker-body table.days td.active+td.select-end:before,.bs-datepicker-body table.days td.in-range+td.is-highlighted:before,.bs-datepicker-body table.days td.in-range+td.select-end:before{background:#e9edf0;width:100%}.bs-datepicker-body table.weeks tr td:nth-child(2).active:before{border-radius:3px 0 0 3px;left:0;width:100%}.bs-datepicker-body table:not(.weeks) tr td:first-child:before{border-radius:3px 0 0 3px}.bs-datepicker-body table.years td span{width:46px;height:46px;line-height:45px;margin:0 auto}.bs-datepicker-body table.years tr:not(:last-child) td span{margin-bottom:8px}.bs-datepicker-body table.months td{height:52px}.bs-datepicker-body table.months td span{padding:6px;border-radius:15px}.bs-datepicker .current-timedate{color:#54708b;font-size:15px;text-align:center;height:30px;line-height:30px;border-radius:20px;border:1px solid #e9edf0;margin-bottom:10px;cursor:pointer;text-transform:uppercase;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}.bs-datepicker .current-timedate span:not(:empty):before{content:"";width:15px;height:16px;display:inline-block;margin-right:4px;vertical-align:text-bottom;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAABMklEQVQoU9VTwW3CQBCcOUgBtEBKSAukAnBKME+wFCAlYIhk8sQlxFABtJAScAsuAPBEewYcxCP8ouxrPDsza61uiVN1o6RNHD4htSCmq49RfO71BvMJqBBkITRf1kmUW49nQRC9h1I5AZlBClaL8aP1fKgOOxCx8aSLs+Q19eZuNO8QmPqJRtDFguy7OAcDbJPs+/BKVPDIPrvD2ZJgWAmVe7O0rI0Vqs1seyWUXpuJoppYCa5L+U++NpNPkr5OE2oMdARsb3gykJT5ydZcL8Z9Ww60nxg2LhjON9li9OwXZzo+xLbp3nC2s9CL2RrueGyVrgwNm8HpsCzZ9EEW6kqXlo1GQe03FzP/7W8Hl0dBtu7Bf7zt6mIwvX1RvzDCm7+q3mAW0Dl/GPdUCeXrZLT9BrDrGkm4qlPvAAAAAElFTkSuQmCC)}.bs-datepicker-multiple{border-radius:4px 0 0 4px}.bs-datepicker-multiple+.bs-datepicker-multiple{margin-left:10px}.bs-datepicker-multiple .bs-datepicker{box-shadow:none;position:relative}.bs-datepicker-multiple .bs-datepicker:not(:last-child){padding-right:10px}.bs-datepicker-multiple .bs-datepicker+.bs-datepicker:after{content:"";display:block;width:14px;height:10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAKCAYAAABrGwT5AAAA1ElEQVQoU42RsQrCUAxF77VuDu7O4oMWW//BURBBpZvgKk4uIrjoqKOTf+DopIO4uYggtFTfw3+pkQqCW1/G5J7kJiFy4m5MxUlxAzgIPHX+lzMPzupRYlYgxiR7vqsOP8YKzsTx0yxFMCUZ+q7aZzlr+OvgoWcAFyAHgat2jLWu48252DdqAihDJGSSJNUUxYmQjs3+hPQBlAh2rG2LCOPnaw3IiGDX99TRCs7ASJsNhUOA7d/LcuHvRG22FIZvsNXw1MX6VZExCilOQKEfeLXr/10+aC9Ho7arh7oAAAAASUVORK5CYII=);position:absolute;top:25px;left:-8px}.bs-datepicker-multiple .bs-datepicker .left{float:left}.bs-datepicker-multiple .bs-datepicker .right{float:right}.bs-datepicker-container{padding:15px}.bs-datepicker .bs-media-container{display:flex}@media (max-width: 768px){.bs-datepicker .bs-media-container{flex-direction:column}}.bs-datepicker .bs-timepicker-in-datepicker-container{display:flex;justify-content:space-around}.bs-datepicker-custom-range{padding:15px;background:#eee}.bs-datepicker-predefined-btns button{width:100%;display:block;height:30px;background-color:#9aaec1;border-radius:4px;color:#fff;border:0;margin-bottom:10px;padding:0 18px;text-align:left;transition:.3s}.bs-datepicker-predefined-btns button:hover{background-color:#54708b}.bs-datepicker-buttons{display:flex;flex-flow:row wrap;justify-content:flex-end;padding-top:10px;border-top:1px solid #e9edf0}.bs-datepicker-buttons .btn-default{margin-left:10px}.bs-datepicker-buttons .btn-today-wrapper{display:flex;flex-flow:row wrap}.bs-datepicker-buttons .clear-right,.bs-datepicker-buttons .today-right{flex-grow:0}.bs-datepicker-buttons .clear-left,.bs-datepicker-buttons .today-left{flex-grow:1}.bs-datepicker-buttons .clear-center,.bs-datepicker-buttons .today-center{flex-grow:.5}.bs-timepicker-container{padding:10px 0}.bs-timepicker-label{color:#54708b;margin-bottom:10px}.bs-timepicker-controls{display:inline-block;vertical-align:top;margin-right:10px}.bs-timepicker-controls button{width:20px;height:20px;border-radius:50%;border:0;background-color:#e9edf0;color:#54708b;font-size:16px;font-weight:700;vertical-align:middle;line-height:0;padding:0;transition:.3s}.bs-timepicker-controls button:hover{background-color:#d5dadd}.bs-timepicker-controls input{width:35px;height:25px;border-radius:13px;text-align:center;border:1px solid #e9edf0}.bs-timepicker .switch-time-format{text-transform:uppercase;min-width:54px;height:25px;border-radius:20px;border:1px solid #e9edf0;background:#fff;color:#54708b;font-size:13px}.bs-timepicker .switch-time-format img{vertical-align:initial;margin-left:4px}bs-datepicker-container,bs-daterangepicker-container{z-index:1080}@media (max-width: 768px){.bs-datepicker{width:min-content;justify-content:center}.bs-datepicker-multiple{display:flex}.bs-datepicker-multiple+.bs-datepicker-multiple{margin-top:10px;margin-left:0}}.theme-default .bs-datepicker-head{background-color:#777}.theme-default .btn-today-wrapper .btn-success,.theme-default .btn-clear-wrapper .btn-success{background-color:#777;border-color:#777}.theme-default .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-default .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-default .btn-today-wrapper .btn-success:focus,.theme-default .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-default .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-default .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#616161;border-color:#616161}.theme-default .btn-today-wrapper .btn-success:hover,.theme-default .btn-clear-wrapper .btn-success:hover{background-color:#6f6e6e;border-color:#6f6e6e}.theme-default .bs-datepicker-predefined-btns button.selected{background-color:#777}.theme-default .bs-datepicker-body table td span.selected,.theme-default .bs-datepicker-body table td.selected span,.theme-default .bs-datepicker-body table td span[class*=select-]:after,.theme-default .bs-datepicker-body table td[class*=select-] span:after{background-color:#777}.theme-default .bs-datepicker-body table td.week span{color:#777}.theme-default .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#777;color:#fff;opacity:.5;transition:0s}.theme-green .bs-datepicker-head{background-color:#5cb85c}.theme-green .btn-today-wrapper .btn-success,.theme-green .btn-clear-wrapper .btn-success{background-color:#5cb85c;border-color:#5cb85c}.theme-green .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-green .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-green .btn-today-wrapper .btn-success:focus,.theme-green .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-green .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-green .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#1e7e34;border-color:#1e7e34}.theme-green .btn-today-wrapper .btn-success:hover,.theme-green .btn-clear-wrapper .btn-success:hover{background-color:#218838;border-color:#218838}.theme-green .bs-datepicker-predefined-btns button.selected{background-color:#5cb85c}.theme-green .bs-datepicker-body table td span.selected,.theme-green .bs-datepicker-body table td.selected span,.theme-green .bs-datepicker-body table td span[class*=select-]:after,.theme-green .bs-datepicker-body table td[class*=select-] span:after{background-color:#5cb85c}.theme-green .bs-datepicker-body table td.week span{color:#5cb85c}.theme-green .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#5cb85c;color:#fff;opacity:.5;transition:0s}.theme-blue .bs-datepicker-head{background-color:#5bc0de}.theme-blue .btn-today-wrapper .btn-success,.theme-blue .btn-clear-wrapper .btn-success{background-color:#5bc0de;border-color:#5bc0de}.theme-blue .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-blue .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-blue .btn-today-wrapper .btn-success:focus,.theme-blue .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-blue .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-blue .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#2aa8cd;border-color:#2aa8cd}.theme-blue .btn-today-wrapper .btn-success:hover,.theme-blue .btn-clear-wrapper .btn-success:hover{background-color:#3ab3d7;border-color:#3ab3d7}.theme-blue .bs-datepicker-predefined-btns button.selected{background-color:#5bc0de}.theme-blue .bs-datepicker-body table td span.selected,.theme-blue .bs-datepicker-body table td.selected span,.theme-blue .bs-datepicker-body table td span[class*=select-]:after,.theme-blue .bs-datepicker-body table td[class*=select-] span:after{background-color:#5bc0de}.theme-blue .bs-datepicker-body table td.week span{color:#5bc0de}.theme-blue .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#5bc0de;color:#fff;opacity:.5;transition:0s}.theme-dark-blue .bs-datepicker-head{background-color:#337ab7}.theme-dark-blue .btn-today-wrapper .btn-success,.theme-dark-blue .btn-clear-wrapper .btn-success{background-color:#337ab7;border-color:#337ab7}.theme-dark-blue .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-dark-blue .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-dark-blue .btn-today-wrapper .btn-success:focus,.theme-dark-blue .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-dark-blue .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-dark-blue .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#266498;border-color:#266498}.theme-dark-blue .btn-today-wrapper .btn-success:hover,.theme-dark-blue .btn-clear-wrapper .btn-success:hover{background-color:#2c6fa9;border-color:#2c6fa9}.theme-dark-blue .bs-datepicker-predefined-btns button.selected{background-color:#337ab7}.theme-dark-blue .bs-datepicker-body table td span.selected,.theme-dark-blue .bs-datepicker-body table td.selected span,.theme-dark-blue .bs-datepicker-body table td span[class*=select-]:after,.theme-dark-blue .bs-datepicker-body table td[class*=select-] span:after{background-color:#337ab7}.theme-dark-blue .bs-datepicker-body table td.week span{color:#337ab7}.theme-dark-blue .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#337ab7;color:#fff;opacity:.5;transition:0s}.theme-red .bs-datepicker-head{background-color:#d9534f}.theme-red .btn-today-wrapper .btn-success,.theme-red .btn-clear-wrapper .btn-success{background-color:#d9534f;border-color:#d9534f}.theme-red .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-red .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-red .btn-today-wrapper .btn-success:focus,.theme-red .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-red .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-red .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#d23531;border-color:#d23531}.theme-red .btn-today-wrapper .btn-success:hover,.theme-red .btn-clear-wrapper .btn-success:hover{background-color:#e33732;border-color:#e33732}.theme-red .bs-datepicker-predefined-btns button.selected{background-color:#d9534f}.theme-red .bs-datepicker-body table td span.selected,.theme-red .bs-datepicker-body table td.selected span,.theme-red .bs-datepicker-body table td span[class*=select-]:after,.theme-red .bs-datepicker-body table td[class*=select-] span:after{background-color:#d9534f}.theme-red .bs-datepicker-body table td.week span{color:#d9534f}.theme-red .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#d9534f;color:#fff;opacity:.5;transition:0s}.theme-orange .bs-datepicker-head{background-color:#f0ad4e}.theme-orange .btn-today-wrapper .btn-success,.theme-orange .btn-clear-wrapper .btn-success{background-color:#f0ad4e;border-color:#f0ad4e}.theme-orange .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active:focus,.theme-orange .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active:focus{box-shadow:none}.theme-orange .btn-today-wrapper .btn-success:focus,.theme-orange .btn-clear-wrapper .btn-success:focus{box-shadow:none}.theme-orange .btn-today-wrapper .btn-success:not(:disabled):not(.disabled):active,.theme-orange .btn-clear-wrapper .btn-success:not(:disabled):not(.disabled):active{background-color:#ed9c29;border-color:#ed9c29}.theme-orange .btn-today-wrapper .btn-success:hover,.theme-orange .btn-clear-wrapper .btn-success:hover{background-color:#ffac35;border-color:#ffac35}.theme-orange .bs-datepicker-predefined-btns button.selected{background-color:#f0ad4e}.theme-orange .bs-datepicker-body table td span.selected,.theme-orange .bs-datepicker-body table td.selected span,.theme-orange .bs-datepicker-body table td span[class*=select-]:after,.theme-orange .bs-datepicker-body table td[class*=select-] span:after{background-color:#f0ad4e}.theme-orange .bs-datepicker-body table td.week span{color:#f0ad4e}.theme-orange .bs-datepicker-body table td.active-week span:hover{cursor:pointer;background-color:#f0ad4e;color:#fff;opacity:.5;transition:0s}v-ui-datepicker{display:inline-flex;width:100%}.bs-datepicker{border:none}.bs-datepicker .bs-datepicker-container{padding:0}.bs-datepicker .bs-datepicker-container .popover-arrow.arrow{display:none}.bs-datepicker .bs-datepicker-container .popover-content.popover-body{padding:1rem 0 0}\n',
                        ],
                        encapsulation: 2,
                        changeDetection: 0,
                    }));
                }
                return t;
            })();
            class Ie {
                isErrorState(a) {
                    return a && a.invalid && a.touched;
                }
            }
            function Pe(t, a) {
                1 & t &&
                    (e.TgZ(0, 'h1', 12),
                    e._uU(
                        1,
                        '\u10d0\u10d8\u10e0\u10e9\u10d8\u10d4\u10d7 \u10db\u10dd\u10e5\u10d0\u10da\u10d0\u10e5\u10d4\u10dd\u10d1\u10d0',
                    ),
                    e.qZA(),
                    e.TgZ(2, 'form', 13)(3, 'v-ui-form-item', 14)(4, 'v-ui-radio-button-group', 15)(
                        5,
                        'v-ui-radio-button',
                        16,
                    )(6, 'span'),
                    e._uU(
                        7,
                        '\u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd\u10e1 \u10db\u10dd\u10e5\u10d0\u10da\u10d0\u10e5\u10d4 \u10d0\u10dc \u10d1\u10d8\u10dc\u10d0\u10d3\u10e0\u10dd\u10d1\u10d8\u10e1 \u10db\u10dd\u10ec\u10db\u10dd\u10d1\u10d8\u10e1 \u10db\u10e5\u10dd\u10dc\u10d4',
                    ),
                    e.qZA()(),
                    e.TgZ(8, 'v-ui-radio-button', 17)(9, 'span'),
                    e._uU(10, '\u10e1\u10ee\u10d5\u10d0'),
                    e.qZA()()(),
                    e.TgZ(11, 'v-ui-form-error'),
                    e._UZ(12, 'svg-icon', 18),
                    e.TgZ(13, 'span'),
                    e._uU(
                        14,
                        '\u10d2\u10d7\u10ee\u10dd\u10d5\u10d7, \u10db\u10dd\u10dc\u10d8\u10e8\u10dc\u10dd\u10d7 \u10d4\u10e0\u10d7-\u10d4\u10e0\u10d7\u10d8 \u10db\u10dc\u10d8\u10e8\u10d5\u10dc\u10d4\u10da\u10dd\u10d1\u10d0',
                    ),
                    e.qZA()()()()),
                    2 & t && (e.xp6(3), e.Q6J('borderless', !0));
            }
            function Oe(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 19)(1, 'button', 20),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).next,
                                u = e.oxw(2);
                            let l, p;
                            return (
                                r(),
                                e.KtG(
                                    null == (l = u.registrationForm.get('chooseCitizenship')) ||
                                        null == (p = l.get('citizenship'))
                                        ? null
                                        : p.markAsTouched(),
                                )
                            );
                        }),
                        e._uU(2, ' \u10d2\u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10d0 '),
                        e.qZA()();
                }
            }
            function Se(t, a) {
                if (
                    (1 & t &&
                        (e.TgZ(0, 'div', 22)(1, 'v-ui-form-item', 23)(2, 'v-ui-form-item-label'),
                        e._uU(3, '\u10e1\u10d0\u10ee\u10d4\u10da\u10d8'),
                        e.qZA(),
                        e._UZ(4, 'input', 27),
                        e.TgZ(5, 'v-ui-form-error')(6, 'span'),
                        e._uU(7),
                        e.ALo(8, 'validationErrorPipe'),
                        e.qZA()()(),
                        e.TgZ(9, 'v-ui-form-item', 23)(10, 'v-ui-form-item-label'),
                        e._uU(
                            11,
                            '\u10d3\u10d0\u10d1\u10d0\u10d3\u10d4\u10d1\u10d8\u10e1 \u10d7\u10d0\u10e0\u10d8\u10e6\u10d8',
                        ),
                        e.qZA(),
                        e._UZ(12, 'v-ui-datepicker', 28),
                        e.TgZ(13, 'v-ui-form-error')(14, 'span'),
                        e._uU(15),
                        e.ALo(16, 'validationErrorPipe'),
                        e.qZA()()()()),
                    2 & t)
                ) {
                    const o = e.oxw(4);
                    let n, i, r, u;
                    e.xp6(1),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                8,
                                5,
                                null == (n = o.registrationForm.get('checkIdentity')) ||
                                    null == (i = n.get('firstname'))
                                    ? null
                                    : i.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('clearBtn', !0),
                        e.xp6(3),
                        e.Q6J('value', o.dt),
                        e.xp6(3),
                        e.Oqu(
                            e.lcZ(
                                16,
                                7,
                                null == (r = o.registrationForm.get('checkIdentity')) ||
                                    null == (u = r.get('dateOfBirth'))
                                    ? null
                                    : u.errors,
                            ),
                        );
                }
            }
            function Ne(t, a) {
                if (
                    (1 & t &&
                        (e.TgZ(0, 'h1', 12),
                        e._uU(
                            1,
                            '\u10db\u10d8\u10e3\u10d7\u10d8\u10d7\u10d4\u10d7 \u10de\u10d8\u10e0\u10d0\u10d3\u10d8 \u10d8\u10dc\u10e4\u10dd\u10e0\u10db\u10d0\u10ea\u10d8\u10d0',
                        ),
                        e.qZA(),
                        e.TgZ(2, 'form', 21)(3, 'div', 22)(4, 'v-ui-form-item', 23)(5, 'v-ui-form-item-label'),
                        e._uU(6, '\u10de\u10d8\u10e0\u10d0\u10d3\u10d8 \u10dc\u10dd\u10db\u10d4\u10e0\u10d8'),
                        e.qZA(),
                        e._UZ(7, 'input', 24),
                        e.TgZ(8, 'v-ui-form-error')(9, 'span'),
                        e._uU(10),
                        e.ALo(11, 'validationErrorPipe'),
                        e.qZA()()(),
                        e.TgZ(12, 'v-ui-form-item', 23)(13, 'v-ui-form-item-label'),
                        e._uU(14, '\u10d2\u10d5\u10d0\u10e0\u10d8'),
                        e.qZA(),
                        e._UZ(15, 'input', 25),
                        e.TgZ(16, 'v-ui-form-error')(17, 'span'),
                        e._uU(18),
                        e.ALo(19, 'validationErrorPipe'),
                        e.qZA()()()(),
                        e.YNc(20, Se, 17, 9, 'div', 26),
                        e.qZA()),
                    2 & t)
                ) {
                    const o = e.oxw(3);
                    let n, i, r, u;
                    e.xp6(4),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                11,
                                5,
                                null == (n = o.registrationForm.get('checkIdentity')) ||
                                    null == (i = n.get('personalNumber'))
                                    ? null
                                    : i.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                19,
                                7,
                                null == (r = o.registrationForm.get('checkIdentity')) || null == (u = r.get('lastname'))
                                    ? null
                                    : u.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('ngIf', o.checkedSuccessfully);
                }
            }
            function Re(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'button', 20),
                        e.NdJ('click', function () {
                            e.CHM(o);
                            const i = e.oxw(4);
                            return e.KtG(i.checkUser());
                        }),
                        e._uU(1, '\u10e8\u10d4\u10db\u10dd\u10ec\u10db\u10d4\u10d1\u10d0'),
                        e.qZA();
                }
            }
            function Me(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'button', 20),
                        e.NdJ('click', function () {
                            e.CHM(o);
                            const i = e.oxw().next;
                            return e.KtG(i());
                        }),
                        e._uU(1, '\u10d2\u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10d0'),
                        e.qZA();
                }
            }
            function qe(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 29)(1, 'button', 30),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).previous;
                            return e.KtG(r());
                        }),
                        e._uU(2, '\u10e3\u10d9\u10d0\u10dc \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0'),
                        e.qZA(),
                        e.YNc(3, Re, 2, 0, 'button', 31),
                        e.YNc(4, Me, 2, 0, 'button', 31),
                        e.qZA();
                }
                if (2 & t) {
                    const o = e.oxw(3);
                    e.xp6(3), e.Q6J('ngIf', !o.checkedSuccessfully), e.xp6(1), e.Q6J('ngIf', o.checkedSuccessfully);
                }
            }
            function Ue(t, a) {
                1 & t &&
                    (e.ynx(0), e.YNc(1, Ne, 21, 9, 'ng-template', 5), e.YNc(2, qe, 5, 2, 'ng-template', 6), e.BQk());
            }
            function Je(t, a) {
                if (
                    (1 & t &&
                        (e.TgZ(0, 'h1', 12),
                        e._uU(
                            1,
                            '\u10db\u10d8\u10e3\u10d7\u10d8\u10d7\u10d4\u10d7 \u10de\u10d8\u10e0\u10d0\u10d3\u10d8 \u10d8\u10dc\u10e4\u10dd\u10e0\u10db\u10d0\u10ea\u10d8\u10d0',
                        ),
                        e.qZA(),
                        e.TgZ(2, 'form', 32)(3, 'div', 33)(4, 'v-ui-form-item', 34)(5, 'v-ui-form-item-label'),
                        e._uU(6, '\u10de\u10d8\u10e0\u10d0\u10d3\u10d8 \u10dc\u10dd\u10db\u10d4\u10e0\u10d8'),
                        e.qZA(),
                        e._UZ(7, 'input', 24),
                        e.TgZ(8, 'v-ui-form-error')(9, 'span'),
                        e._uU(10),
                        e.ALo(11, 'validationErrorPipe'),
                        e.qZA()()(),
                        e.TgZ(12, 'v-ui-form-item', 34)(13, 'v-ui-form-item-label'),
                        e._uU(14, '\u10d2\u10d5\u10d0\u10e0\u10d8'),
                        e.qZA(),
                        e._UZ(15, 'input', 25),
                        e.TgZ(16, 'v-ui-form-error')(17, 'span'),
                        e._uU(18),
                        e.ALo(19, 'validationErrorPipe'),
                        e.qZA()()()(),
                        e.TgZ(20, 'div', 33)(21, 'v-ui-form-item', 34)(22, 'v-ui-form-item-label'),
                        e._uU(23, '\u10e1\u10d0\u10ee\u10d4\u10da\u10d8'),
                        e.qZA(),
                        e._UZ(24, 'input', 27),
                        e.TgZ(25, 'v-ui-form-error')(26, 'span'),
                        e._uU(27),
                        e.ALo(28, 'validationErrorPipe'),
                        e.qZA()()(),
                        e.TgZ(29, 'v-ui-form-item', 34)(30, 'v-ui-form-item-label'),
                        e._uU(
                            31,
                            '\u10d3\u10d0\u10d1\u10d0\u10d3\u10d4\u10d1\u10d8\u10e1 \u10d7\u10d0\u10e0\u10d8\u10e6\u10d8',
                        ),
                        e.qZA(),
                        e._UZ(32, 'v-ui-datepicker', 28),
                        e.TgZ(33, 'v-ui-form-error')(34, 'span'),
                        e._uU(35),
                        e.ALo(36, 'validationErrorPipe'),
                        e.qZA()()()()(),
                        e._uU(37)),
                    2 & t)
                ) {
                    const o = a.isValid,
                        n = e.oxw(3);
                    let i, r, u, l, p, m, O, S;
                    e.xp6(4),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                11,
                                10,
                                null == (i = n.registrationForm.get('checkIdentityForeigner')) ||
                                    null == (r = i.get('personalNumber'))
                                    ? null
                                    : r.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                19,
                                12,
                                null == (u = n.registrationForm.get('checkIdentityForeigner')) ||
                                    null == (l = u.get('lastname'))
                                    ? null
                                    : l.errors,
                            ),
                        ),
                        e.xp6(3),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                28,
                                14,
                                null == (p = n.registrationForm.get('checkIdentityForeigner')) ||
                                    null == (m = p.get('firstname'))
                                    ? null
                                    : m.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('clearBtn', !0),
                        e.xp6(3),
                        e.Q6J('value', n.dt),
                        e.xp6(3),
                        e.Oqu(
                            e.lcZ(
                                36,
                                16,
                                null == (O = n.registrationForm.get('checkIdentityForeigner')) ||
                                    null == (S = O.get('dateOfBirth'))
                                    ? null
                                    : S.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.hij(' ', o() ? 'valid' : 'invalid', ' ');
                }
            }
            function Ge(t, a) {
                1 & t && (e.ynx(0), e.YNc(1, Je, 38, 18, 'ng-template', 5), e.BQk());
            }
            function Qe(t, a) {
                if (
                    (1 & t &&
                        (e.TgZ(0, 'h1', 12),
                        e._uU(
                            1,
                            '\u10e9\u10d0\u10ec\u10d4\u10e0\u10d4\u10d7 \u10db\u10dd\u10d1\u10d8\u10da\u10e3\u10e0\u10d8\u10e1 \u10dc\u10dd\u10db\u10d4\u10e0\u10d8',
                        ),
                        e.qZA(),
                        e.TgZ(2, 'form', 35)(3, 'v-ui-form-item', 23)(4, 'v-ui-form-item-label'),
                        e._uU(
                            5,
                            '\u10db\u10dd\u10d1\u10d8\u10da\u10e3\u10e0\u10d8\u10e1 \u10dc\u10dd\u10db\u10d4\u10e0\u10d8',
                        ),
                        e.qZA(),
                        e._UZ(6, 'input', 36),
                        e.TgZ(7, 'v-ui-form-error')(8, 'span'),
                        e._uU(9),
                        e.ALo(10, 'validationErrorPipe'),
                        e.qZA()()(),
                        e._UZ(11, 'div', 37),
                        e.qZA()),
                    2 & t)
                ) {
                    const o = e.oxw(2);
                    let n, i;
                    e.xp6(3),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                10,
                                2,
                                null == (n = o.registrationForm.get('mobile')) || null == (i = n.get('mobileNumber'))
                                    ? null
                                    : i.errors,
                            ),
                        );
                }
            }
            function Ve(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'button', 20),
                        e.NdJ('click', function () {
                            e.CHM(o);
                            const i = e.oxw(3);
                            return e.KtG(i.checkMobile());
                        }),
                        e._uU(1, ' \u10e8\u10d4\u10db\u10dd\u10ec\u10db\u10d4\u10d1\u10d0 '),
                        e.qZA();
                }
            }
            function je(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'button', 20),
                        e.NdJ('click', function () {
                            e.CHM(o);
                            const i = e.oxw().next;
                            return e.KtG(i());
                        }),
                        e._uU(1, '\u10d2\u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10d0'),
                        e.qZA();
                }
            }
            function He(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 29)(1, 'button', 30),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).previous;
                            return e.KtG(r());
                        }),
                        e._uU(2, '\u10e3\u10d9\u10d0\u10dc \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0'),
                        e.qZA(),
                        e.YNc(3, Ve, 2, 0, 'button', 31),
                        e.YNc(4, je, 2, 0, 'button', 31),
                        e.qZA();
                }
                if (2 & t) {
                    const o = e.oxw(2);
                    e.xp6(3),
                        e.Q6J('ngIf', !o.mobileNumberCheckedSuccessfully),
                        e.xp6(1),
                        e.Q6J('ngIf', o.mobileNumberCheckedSuccessfully);
                }
            }
            function Ye(t, a) {
                if (
                    (1 & t &&
                        (e.TgZ(0, 'h1', 12),
                        e._uU(
                            1,
                            '\u10e8\u10d4\u10d8\u10e7\u10d5\u10d0\u10dc\u10d4\u10d7 \u10de\u10d0\u10e0\u10dd\u10da\u10d8',
                        ),
                        e.qZA(),
                        e.TgZ(2, 'form', 38)(3, 'v-ui-form-item', 23)(4, 'v-ui-form-item-label'),
                        e._uU(5, '\u10de\u10d0\u10e0\u10dd\u10da\u10d8'),
                        e.qZA(),
                        e._UZ(6, 'input', 39),
                        e.TgZ(7, 'v-ui-form-error')(8, 'span'),
                        e._uU(9),
                        e.ALo(10, 'validationErrorPipe'),
                        e.qZA()()(),
                        e.TgZ(11, 'v-ui-form-item', 23)(12, 'v-ui-form-item-label'),
                        e._uU(
                            13,
                            '\u10d2\u10d0\u10d8\u10db\u10d4\u10dd\u10e0\u10d4\u10d7 \u10de\u10d0\u10e0\u10dd\u10da\u10d8',
                        ),
                        e.qZA(),
                        e._UZ(14, 'input', 40),
                        e.TgZ(15, 'v-ui-form-error')(16, 'span'),
                        e._uU(17),
                        e.ALo(18, 'validationErrorPipe'),
                        e.qZA()()()()),
                    2 & t)
                ) {
                    const o = e.oxw(2);
                    let n, i, r, u;
                    e.xp6(3),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                10,
                                4,
                                null == (n = o.registrationForm.get('passwords')) || null == (i = n.get('password'))
                                    ? null
                                    : i.errors,
                            ),
                        ),
                        e.xp6(2),
                        e.Q6J('clearBtn', !0),
                        e.xp6(6),
                        e.Oqu(
                            e.lcZ(
                                18,
                                6,
                                null == (r = o.registrationForm.get('passwords')) ||
                                    null == (u = r.get('repeatPassword'))
                                    ? null
                                    : u.errors,
                            ),
                        );
                }
            }
            function We(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 29)(1, 'button', 30),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).previous;
                            return e.KtG(r());
                        }),
                        e._uU(2, '\u10e3\u10d9\u10d0\u10dc \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0'),
                        e.qZA(),
                        e.TgZ(3, 'button', 20),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).next;
                            return e.KtG(r());
                        }),
                        e._uU(4, '\u10d2\u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10d0'),
                        e.qZA()();
                }
            }
            function Le(t, a) {
                1 & t &&
                    (e.TgZ(0, 'h1', 12),
                    e._uU(
                        1,
                        '\u10ec\u10d4\u10e1\u10d4\u10d1\u10d8 \u10d3\u10d0 \u10de\u10d8\u10e0\u10dd\u10d1\u10d4\u10d1\u10d8',
                    ),
                    e.qZA(),
                    e.TgZ(2, 'form', 41)(3, 'v-ui-form-item', 14)(4, 'div', 42)(5, 'span', 43),
                    e._uU(
                        6,
                        '\u10d7\u10e5\u10d5\u10d4\u10dc\u10e1 \u10db\u10d8\u10d4\u10e0 \u10de\u10e0\u10dd\u10e4\u10d4\u10e1\u10d8\u10e3\u10da\u10d8 \u10d2\u10d0\u10dc\u10d0\u10d7\u10da\u10d4\u10d1\u10d8\u10e1 \u10db\u10d8\u10e6\u10d4\u10d1\u10d8\u10e1 \u10db\u10e1\u10e3\u10e0\u10d5\u10d4\u10da\u10d7\u10d0 \u10e1\u10d0\u10e0\u10d4\u10d2\u10d8\u10e1\u10e2\u10e0\u10d0\u10ea\u10d8\u10dd \u10d5\u10d4\u10d1-\u10d2\u10d5\u10d4\u10e0\u10d3\u10d6\u10d4 (vet.emis.ge) \u10d2\u10d0\u10dc\u10d7\u10d0\u10d5\u10e1\u10d4\u10d1\u10e3\u10da\u10d8 \u10d8\u10dc\u10e4\u10dd\u10e0\u10db\u10d0\u10ea\u10d8\u10d0 \u201e\u10de\u10d4\u10e0\u10e1\u10dd\u10dc\u10d0\u10da\u10e3\u10e0 \u10db\u10dd\u10dc\u10d0\u10ea\u10d4\u10db\u10d7\u10d0 \u10d3\u10d0\u10ea\u10d5\u10d8\u10e1 \u10e8\u10d4\u10e1\u10d0\u10ee\u10d4\u10d1\u201c \u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd\u10e1 \u10d9\u10d0\u10dc\u10dd\u10dc\u10d8\u10e1 \u10d7\u10d0\u10dc\u10d0\u10ee\u10db\u10d0\u10d3, \u10e8\u10d4\u10d8\u10ea\u10d0\u10d5\u10e1 \u10de\u10d4\u10e0\u10e1\u10dd\u10dc\u10d0\u10da\u10e3\u10e0 \u10db\u10dd\u10dc\u10d0\u10ea\u10d4\u10db\u10d4\u10d1\u10e1, \u10db\u10d0\u10d7 \u10e8\u10dd\u10e0\u10d8\u10e1, \u10e8\u10d4\u10e1\u10d0\u10eb\u10da\u10dd\u10d0 \u10e8\u10d4\u10d8\u10ea\u10d0\u10d5\u10d3\u10d4\u10e1 \u10d2\u10d0\u10dc\u10e1\u10d0\u10d9\u10e3\u10d7\u10e0\u10d4\u10d1\u10e3\u10da\u10d8 \u10d9\u10d0\u10e2\u10d4\u10d2\u10dd\u10e0\u10d8\u10d8\u10e1 \u10db\u10dd\u10dc\u10d0\u10ea\u10d4\u10db\u10d4\u10d1\u10e1\u10d0\u10ea. \u10d2\u10d7\u10ee\u10dd\u10d5\u10d7, \u10d2\u10d0\u10d8\u10d7\u10d5\u10d0\u10da\u10d8\u10e1\u10ec\u10d8\u10dc\u10dd\u10d7, \u10e0\u10dd \u10d7\u10e5\u10d5\u10d4\u10dc\u10d8 \u10de\u10d4\u10e0\u10e1\u10dd\u10dc\u10d0\u10da\u10e3\u10e0\u10d8 \u10db\u10dd\u10dc\u10d0\u10ea\u10d4\u10db\u10d4\u10d1\u10d8 \u10e8\u10d4\u10e1\u10d0\u10eb\u10da\u10dd\u10d0 \u10d3\u10d0\u10db\u10e3\u10e8\u10d0\u10d5\u10d3\u10d4\u10e1 \u10d9\u10d0\u10dc\u10dd\u10dc\u10db\u10d3\u10d4\u10d1\u10da\u10dd\u10d1\u10d8\u10d7 \u10d2\u10d0\u10d7\u10d5\u10d0\u10da\u10d8\u10e1\u10ec\u10d8\u10dc\u10d4\u10d1\u10e3\u10da \u10db\u10dd\u10d7\u10ee\u10dd\u10d5\u10dc\u10d0\u10d7\u10d0 \u10e8\u10d4\u10e1\u10d0\u10d1\u10d0\u10db\u10d8\u10e1\u10d0\u10d3.',
                    ),
                    e.qZA(),
                    e.TgZ(7, 'v-ui-checkbox', 44),
                    e._uU(
                        8,
                        ' \u10d2\u10d0\u10d5\u10d4\u10ea\u10d0\u10dc\u10d8 \u10d3\u10d0 \u10d5\u10d4\u10d7\u10d0\u10dc\u10ee\u10db\u10d4\u10d1\u10d8 \u10ec\u10d4\u10e1\u10d4\u10d1\u10e1 ',
                    ),
                    e.qZA()()()()),
                    2 & t && (e.xp6(3), e.Q6J('borderless', !0));
            }
            function $e(t, a) {
                if (1 & t) {
                    const o = e.EpF();
                    e.TgZ(0, 'div', 29)(1, 'button', 30),
                        e.NdJ('click', function () {
                            const r = e.CHM(o).previous;
                            return e.KtG(r());
                        }),
                        e._uU(2, '\u10e3\u10d9\u10d0\u10dc \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0'),
                        e.qZA(),
                        e.TgZ(3, 'button', 20),
                        e.NdJ('click', function () {
                            e.CHM(o);
                            const i = e.oxw(2);
                            return e.KtG(i.onSubmit());
                        }),
                        e._uU(4, '\u10d3\u10d0\u10e1\u10e0\u10e3\u10da\u10d4\u10d1\u10d0'),
                        e.qZA()();
                }
            }
            function Ke(t, a) {
                if (
                    (1 & t &&
                        (e.ynx(0),
                        e.TgZ(1, 'form', 1)(2, 'v-ui-wizard', 2, 3)(4, 'v-ui-wizard-step', 4),
                        e.YNc(5, Pe, 15, 1, 'ng-template', 5),
                        e.YNc(6, Oe, 3, 0, 'ng-template', 6),
                        e.qZA(),
                        e.TgZ(7, 'v-ui-wizard-step', 7),
                        e.YNc(8, Ue, 3, 0, 'ng-container', 8),
                        e.YNc(9, Ge, 2, 0, 'ng-container', 8),
                        e.qZA(),
                        e.TgZ(10, 'v-ui-wizard-step', 9),
                        e.YNc(11, Qe, 12, 4, 'ng-template', 5),
                        e.YNc(12, He, 5, 2, 'ng-template', 6),
                        e.qZA(),
                        e.TgZ(13, 'v-ui-wizard-step', 10),
                        e.YNc(14, Ye, 19, 8, 'ng-template', 5),
                        e.YNc(15, We, 5, 0, 'ng-template', 6),
                        e.qZA(),
                        e.TgZ(16, 'v-ui-wizard-step', 11),
                        e.YNc(17, Le, 9, 1, 'ng-template', 5),
                        e.YNc(18, $e, 5, 0, 'ng-template', 6),
                        e.qZA()()(),
                        e.BQk()),
                    2 & t)
                ) {
                    const o = e.oxw();
                    e.xp6(1),
                        e.Q6J('formGroup', o.registrationForm),
                        e.xp6(1),
                        e.Q6J('horizontal', !0),
                        e.xp6(6),
                        e.Q6J('ngIf', '1' === o.citizenshipValue),
                        e.xp6(1),
                        e.Q6J('ngIf', '2' === o.citizenshipValue);
                }
            }
            let Xe = (() => {
                class t {
                    constructor() {
                        (this.destroyRef$ = (0, e.f3M)(e.ktI)),
                            (this.cdr = (0, e.f3M)(e.sBO)),
                            (this.registrationForm = new s.cw({
                                chooseCitizenship: new s.cw({ citizenship: new s.NI(null, [s.kI.required]) }),
                                checkIdentity: new s.cw({
                                    lastname: new s.NI(null, [s.kI.required]),
                                    personalNumber: new s.NI(null, [
                                        s.kI.required,
                                        P('^[0-9]{11}$', { personalNumber: !0 }),
                                    ]),
                                    firstname: new s.NI(null, [s.kI.required]),
                                    dateOfBirth: new s.NI(null, [s.kI.required]),
                                }),
                                checkIdentityForeigner: new s.cw({
                                    firstname: new s.NI(null, [s.kI.required]),
                                    lastname: new s.NI(null, [s.kI.required]),
                                    personalNumber: new s.NI(null, [s.kI.required]),
                                    dateOfBirth: new s.NI(null),
                                }),
                                mobile: new s.cw({
                                    mobileNumber: new s.NI(null, [s.kI.required, P('^5\\d{8}$', { mobileNumber: !0 })]),
                                }),
                                passwords: new s.cw({
                                    password: new s.NI(null, [s.kI.required]),
                                    repeatPassword: new s.NI(null, [s.kI.required]),
                                }),
                                termsAndConditions: new s.cw({ accepted: new s.NI(null, [s.kI.required]) }),
                            })),
                            (this.dt = new Date()),
                            (this.citizenshipValue = null),
                            (this.checking = !1),
                            (this.checkedSuccessfully = !1),
                            (this.mobileNumberCheckedSuccessfully = !1);
                    }
                    ngOnInit() {
                        this.registrationForm
                            .get('chooseCitizenship')
                            ?.valueChanges.pipe((0, h.sL)(this.destroyRef$))
                            .subscribe((o) => {
                                this.citizenshipValue = o.citizenship;
                            });
                    }
                    checkUser() {
                        const o = this.registrationForm.get('checkIdentity')?.get('personalNumber'),
                            n = this.registrationForm.get('checkIdentity')?.get('lastname');
                        o?.valid && n?.valid
                            ? ((this.checking = !0),
                              setTimeout(() => {
                                  (this.checking = !1), (this.checkedSuccessfully = !0), this.cdr.markForCheck();
                              }, 1e3))
                            : (o?.markAsTouched(), n?.markAsTouched());
                    }
                    checkMobile() {
                        const o = this.registrationForm.get('mobile')?.get('mobileNumber');
                        o?.valid
                            ? ((this.checking = !0),
                              setTimeout(() => {
                                  (this.checking = !1),
                                      (this.mobileNumberCheckedSuccessfully = !0),
                                      this.cdr.markForCheck();
                              }, 1e3))
                            : o?.markAsTouched();
                    }
                    onSubmit() {
                        console.log(this.registrationForm.value);
                    }
                    static #e = (this.ɵfac = function (n) {
                        return new (n || t)();
                    });
                    static #t = (this.ɵcmp = e.Xpm({
                        type: t,
                        selectors: [['lib-features-registration']],
                        standalone: !0,
                        features: [e._Bn([{ provide: E, useClass: Ie }]), e.jDz],
                        decls: 1,
                        vars: 0,
                        consts: [
                            [4, 'transloco'],
                            [3, 'formGroup'],
                            [3, 'horizontal'],
                            ['wizardComponent', ''],
                            [
                                'id',
                                '1',
                                'title',
                                '\u10db\u10dd\u10e5\u10d0\u10da\u10d0\u10e5\u10d4\u10dd\u10d1\u10d8\u10e1 \u10d0\u10e0\u10e9\u10d4\u10d5\u10d0',
                            ],
                            ['vUiWizardStepContent', ''],
                            ['vUiWizardStepFooter', ''],
                            [
                                'id',
                                '2',
                                'title',
                                '\u10de\u10d8\u10e0\u10dd\u10d5\u10dc\u10d4\u10d1\u10d8\u10e1 \u10d2\u10d0\u10d3\u10d0\u10db\u10dd\u10ec\u10db\u10d4\u10d1\u10d0',
                            ],
                            [4, 'ngIf'],
                            [
                                'id',
                                '3',
                                'title',
                                '\u10db\u10dd\u10d1\u10d8\u10da\u10e3\u10e0\u10d8\u10e1 \u10d3\u10d0\u10d3\u10d0\u10e1\u10e2\u10e3\u10e0\u10d4\u10d1\u10d0',
                            ],
                            [
                                'id',
                                '4',
                                'title',
                                '\u10de\u10d0\u10e0\u10dd\u10da\u10d8\u10e1 \u10e8\u10d4\u10e5\u10db\u10dc\u10d0',
                            ],
                            [
                                'id',
                                '5',
                                'title',
                                '\u10ec\u10d4\u10e1\u10d4\u10d1\u10d8 \u10d3\u10d0 \u10de\u10d8\u10e0\u10dd\u10d1\u10d4\u10d1\u10d8',
                            ],
                            [2, 'margin-bottom', '3rem'],
                            ['formGroupName', 'chooseCitizenship', 'vUiWizardStepControlContent', ''],
                            [3, 'borderless'],
                            ['formControlName', 'citizenship'],
                            ['value', '1'],
                            ['value', '2'],
                            ['src', 'assets/icons/exclamation-point.svg'],
                            [1, 'd-flex', 'justify-content-end', 'mt-2'],
                            ['v-ui-button', '', 3, 'click'],
                            ['formGroupName', 'checkIdentity', 'vUiWizardStepControlContent', ''],
                            [1, 'd-flex', 'gap-4'],
                            [1, 'flex-fill', 3, 'clearBtn'],
                            ['v-ui-input', '', 'formControlName', 'personalNumber'],
                            ['v-ui-input', '', 'formControlName', 'lastname'],
                            ['class', 'd-flex gap-4', 4, 'ngIf'],
                            ['v-ui-input', '', 'formControlName', 'firstname'],
                            [
                                'formControlName',
                                'dateOfBirth',
                                'minDate',
                                '25/05/1997',
                                'maxDate',
                                '25/05/2000',
                                3,
                                'value',
                            ],
                            [1, 'd-flex', 'justify-content-between', 'mt-2'],
                            ['v-ui-button', '', 'color', 'secondary', 3, 'click'],
                            ['v-ui-button', '', 3, 'click', 4, 'ngIf'],
                            ['formGroupName', 'checkIdentityForeigner', 'vUiWizardStepControlContent', ''],
                            [1, 'flex'],
                            [3, 'clearBtn'],
                            ['formGroupName', 'mobile', 'vUiWizardStepControlContent', '', 1, 'd-flex'],
                            ['v-ui-input', '', 'formControlName', 'mobileNumber'],
                            [1, 'flex-fill'],
                            ['formGroupName', 'passwords', 'vUiWizardStepControlContent', '', 1, 'd-flex', 'gap-4'],
                            ['v-ui-input', '', 'formControlName', 'password', 'type', 'password'],
                            ['v-ui-input', '', 'formControlName', 'repeatPassword', 'type', 'password'],
                            ['formGroupName', 'termsAndConditions', 'vUiWizardStepControlContent', ''],
                            [1, 'flex', 'flex-column'],
                            [1, 'terms-and-conditions'],
                            ['formControlName', 'accepted'],
                        ],
                        template: function (n, i) {
                            1 & n && e.YNc(0, Ke, 19, 4, 'ng-container', 0);
                        },
                        dependencies: [
                            d.ez,
                            d.O5,
                            J,
                            V,
                            s.UX,
                            s._Y,
                            s.Fj,
                            s.JJ,
                            s.JL,
                            s.sg,
                            s.u,
                            s.x0,
                            $,
                            X,
                            T,
                            v.y4,
                            v.KI,
                            oe,
                            A,
                            C,
                            se,
                            _e,
                            ye,
                            Z,
                            we,
                            F,
                            Fe,
                            B.bk,
                        ],
                        styles: ['section[_ngcontent-%COMP%]{padding:50px}'],
                        changeDetection: 0,
                    }));
                }
                return t;
            })();
            function P(t, a) {
                const o = new RegExp(t);
                return (n) => (o.test(n.value) ? null : a);
            }
        },
    },
]);
