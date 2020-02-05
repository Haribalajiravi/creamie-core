import { Selector } from 'testcafe';

fixture `Two Way Binder`
    .page `http://localhost:8080/tests/test_example/src/index.html`;

test('input value reflection in dom', async t => {
    await t
        .typeText('#binder-textbox', 'creamie')
        .expect(Selector('#binder-reflecter').innerText).eql('creamie');
});