import { Selector } from 'testcafe';

fixture `Creamie Basis Testcases`
    .page `http://localhost:8080/tests/test_example/src/index.html`;

test('Binder: input value reflection in dom', async t => {
    await t
        .typeText('#binder-textbox', 'creamie')
        .expect(Selector('#binder-reflecter').innerText).eql('creamie');
});

test('Events: click event', async t => {
    await t
        .click('#event-click')
        .expect(Selector('#binder-reflecter').innerText).eql('Data Changed');
});
