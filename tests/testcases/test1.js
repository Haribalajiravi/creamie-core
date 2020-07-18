import { Selector, ClientFunction } from 'testcafe';

fixture`Creamie Basis Testcases`
    .page`http://localhost:8080/tests/test_example/src/index.html`;

const getPathName = ClientFunction(() => window.location.pathname);

/**
 * Binder
 */
test('Binder: input value reflection in dom', async t => {
    await t
        .typeText('#binder-textbox', 'creamie')
        .expect(Selector('#binder-reflecter').innerText).eql('creamie');
});

/**
 * Events
 */
test('Events: click event', async t => {
    await t
        .click('#event-click')
        .expect(Selector('#binder-reflecter').innerText).eql('Data Changed');
});

/**
 * If directive - hide
 */
test('If: hide', async t => {
    await t
        .click('#hide')
        .expect(Selector('#if-directive').exists).notOk();
});

/**
 * If directive - show
 */
test('If: show', async t => {
    await t
        .click('#show')
        .expect(Selector('#if-directive').exists).ok();
});

/**
 * Plugins
 */
test('Plugin Exclude: Checking textfield', async t => {
    await t
        .typeText('#textfield', 'creamie')
        .expect(Selector('#textfield-reflector').innerText).eql('nodata');
});

test('Plugins: checkbox with binder', async t => {
    await t
        .click('#checker')
        .expect(Selector('#checker-reflector').innerText).eql('true');
});

/**
 * Router
 */
test('Router: url change without parameters', async t => {
    await t.click('#router-test');
    let path = await getPathName();
    await t.expect(path).eql('/tester');
});

test('Router: url change with parameters', async t => {
    await t.click('#router-test-creamie');
    let path = await getPathName();
    await t.expect(path).eql('/test/creamie');
});

test('Router: url param check in variable', async t => {
    await t
        .click('#router-test-creamie')
        .click('#get-router-param')
        .expect(Selector('#router-param-reflector').innerText).eql('creamie');
});