import type { Composer } from 'vue-i18n';
import type { Complectation, Vehicle } from '@bycar-in-ua/sdk';

import type { InfoBullet } from '../interfaces';
import {
  ElectricStation,
  Engine as EngineIcon,
  GasStation,
  GearboxAuto,
  GearboxManual,
  Speedometer,
} from '../icons';

export function getVehicleInfoBullets(
  vehicle: Vehicle,
  t: Composer['t']
): InfoBullet[] {
  const bullets: InfoBullet[] = [];

  const baseComplectation =
    vehicle.complectations?.find((complectation) => complectation.base) ??
    vehicle.complectations?.[0];

  const basePowerUnit = baseComplectation?.powerUnits?.[0];

  if (!baseComplectation || !basePowerUnit) {
    return bullets;
  }

  if (basePowerUnit.engine?.power) {
    bullets.push({
      text: `${basePowerUnit.engine.power} ${t('units.power')}`,
      title: `${t('from')} ${basePowerUnit.engine.power} ${t('units.power')}`,
      icon: EngineIcon,
    });
  }

  if (basePowerUnit.transmission?.gearbox.type) {
    const type = t(
      `vehicle.transmission.gearbox.types.${basePowerUnit.transmission.gearbox.type}`
    );
    const subType = t(
      `vehicle.transmission.gearbox.subTypes.${basePowerUnit.transmission.gearbox.subType}`
    );

    bullets.push({
      text: type,
      title: `${type} ${
        basePowerUnit.transmission.gearbox?.subType ? `(${subType})` : ''
      }`,
      icon:
        basePowerUnit.transmission?.gearbox.type === 'mechanical'
          ? GearboxManual
          : GearboxAuto,
    });
  }

  if (
    basePowerUnit.engine?.isElectric &&
    basePowerUnit.engine.electric.electricDistanceReserve
  ) {
    bullets.push({
      text: `${basePowerUnit.engine.electric.electricDistanceReserve} км.`,
      title: t('vehicle.engine.electricDistanceReserve'),
      icon: ElectricStation,
    });
  } else if (basePowerUnit.consumption?.mixed) {
    bullets.push({
      text: `${basePowerUnit.consumption.mixed} ${t('units.volume')}.`,
      title: t('vehicle.powerUnits.consumption'),
      icon: GasStation,
    });
  }

  if (basePowerUnit.maxSpeed) {
    bullets.push({
      text: `${basePowerUnit.maxSpeed} км./г`,
      title: t('vehicle.powerUnits.maxSpeed'),
      icon: Speedometer,
    });
  }

  return bullets.slice(0, 3);
}

export function getPriceRange(complectations?: Complectation[]): string {
  if (!complectations?.length) {
    return '';
  }

  const prices = complectations
    .flatMap((complectation) =>
      complectation.powerUnits?.map(({ price }) => price)
    )
    .filter(Boolean) as number[];

  if (!prices.length) {
    return '';
  }

  if (prices.length === 1) {
    return `$${prices[0]}`;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return `$${min} - $${max}`;
}

export function getCarTitle(vehicle: Vehicle) {
  const titleParts = [];

  if (vehicle.brand?.displayName) {
    titleParts.push(vehicle.brand.displayName);
  }

  titleParts.push(vehicle.model);

  return titleParts.join(' ').trim();
}

export function getComplectationsSummary(
  complectations: Vehicle['complectations'] = []
) {
  return complectations
    ?.map((complectation) => {
      const priceRange = getPriceRange([complectation]);

      return complectation.displayName + (priceRange ? ` (${priceRange})` : '');
    })
    .join(', ');
}
