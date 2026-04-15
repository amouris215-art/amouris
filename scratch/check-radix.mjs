import * as Radix from 'radix-ui';
console.log('Radix exports:', Object.keys(Radix));
if (Radix.Slot) {
  console.log('Slot type:', typeof Radix.Slot);
  console.log('Slot keys:', Object.keys(Radix.Slot));
}
