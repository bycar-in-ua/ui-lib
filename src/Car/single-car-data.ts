import type { Component } from "vue";
import type { Composer } from "vue-i18n";
import {
  BodyType,
  type Engine,
  type PowerUnit,
  type Transmission,
  type Vehicle,
} from "@bycar-in-ua/sdk";

import type { InfoBlock, InfoBulletProps } from "./types";
import {
  SUV,
  Engine as EngineIcon,
  Drive,
  ElectricStation,
  GasStation,
  Coupe,
  Hatchback,
  Minivan,
  Sedan,
} from "../icons";

export function getFullInfoBullets(
  {
    car,
    powerUnit,
  }: {
    car: Vehicle;
    powerUnit?: PowerUnit | null;
  },
  t: Composer["t"]
): InfoBulletProps[] {
  const bodyType = t(`vehicle.bodyTypes.items.${car.bodyType}`)
    .split("/")[0]
    .trim();

  const bullets: InfoBulletProps[] = [
    {
      title: t("vehicle.bodyTypes.title"),
      value: bodyType,
      icon: getBodyTypeIcon(car.bodyType),
    },
  ];

  if (powerUnit?.engine?.power) {
    bullets.push({
      title: t("vehicle.engine.power"),
      value: `${powerUnit.engine.power} ${t("units.power")}`,
      icon: EngineIcon,
    });
  }

  if (powerUnit?.transmission) {
    const driveWord = t("vehicle.transmission.drive").toLowerCase();
    const drive = t(
      `vehicle.transmission.driveType.${powerUnit.transmission.drive}`
    );

    const transmissionParts = [
      `${drive} ${driveWord}`,
      powerUnit.transmission.gearbox.type
        ? t(
            `vehicle.transmission.gearbox.types.${powerUnit.transmission.gearbox.type}`
          )
        : null,
    ].filter(Boolean);

    bullets.push({
      title: t("vehicle.powerUnits.transmission"),
      value: transmissionParts.join(", "),
      icon: Drive,
    });
  }

  if (
    powerUnit?.engine?.isElectric &&
    powerUnit.engine.electric.electricDistanceReserve
  ) {
    bullets.push({
      title: t("vehicle.engine.electricDistanceReserve"),
      value: `${powerUnit.engine.electric.electricDistanceReserve} км.`,
      icon: ElectricStation,
    });
  } else if (powerUnit?.consumption?.mixed) {
    bullets.push({
      title: t("vehicle.powerUnits.consumption"),
      value: `${powerUnit.consumption.mixed} ${t("units.volume")}.`,
      icon: GasStation,
    });
  }

  return bullets;
}

export function getBodyTypeIcon(bodyType?: BodyType): Component {
  switch (bodyType) {
    case BodyType.SUV: {
      return SUV;
    }

    case BodyType.coupe: {
      return Coupe;
    }

    case BodyType.hatchback: {
      return Hatchback;
    }

    case BodyType.minivan: {
      return Minivan;
    }

    default:
      return Sedan;
  }
}

export function getPowerUnitTitle(powerUnit: PowerUnit): string {
  const parts: Array<string | undefined> = [
    getDisplacement(powerUnit.engine?.displacement),
  ];

  if (powerUnit.engine?.isHybrid) {
    if (powerUnit.engine.hybrid.hybridRechargeable) {
      parts.push("Plug-in Hybrid");
    } else {
      parts.push("Hybrid");
    }
  }

  if (powerUnit.engine?.isSoftHybrid) {
    parts.push("Mild Hybrid");
  }

  parts.push(powerUnit.engine?.tradename);

  return parts.filter(Boolean).join(" ");
}

function getDisplacement(displacement: Engine["displacement"]) {
  return displacement ? (Math.round(displacement / 100) / 10).toFixed(1) : "";
}

export function getPowerUnitSubtitle(powerUnit: PowerUnit, t: Composer["t"]) {
  const parts = [];

  if (powerUnit.transmission?.gearbox.type) {
    parts.push(
      t(
        `vehicle.transmission.gearbox.types.${powerUnit.transmission.gearbox.type}`
      )
    );
  }

  if (powerUnit.engine?.power) {
    parts.push(`${powerUnit.engine.power} ${t("units.power")}`);
  }

  if (powerUnit.transmission?.drive) {
    parts.push(powerUnit.transmission.drive);
  }

  return parts.filter(Boolean).join(" ");
}

function getSafeValue<TCheck, TValue>(
  checkable: TCheck,
  value?: TValue
): NonNullable<TValue> | string {
  return checkable ? ((value ?? checkable) as NonNullable<TValue>) : "-";
}

export function getGeneralInfoBlock(car: Vehicle, t: Composer["t"]): InfoBlock {
  return {
    title: t("vehicle.generalCharacteristics.title"),
    defaultOpen: true,
    items: [
      {
        title: t("vehicle.model"),
        value: `${car.brand?.displayName} ${car.model}`,
      },
      {
        title: t("vehicle.bodyName"),
        value: getSafeValue(car.bodyName, car.bodyName),
      },
      {
        title: t("vehicle.modelYear"),
        value: [car.yearFrom, car.yearTo].filter(Boolean).join(" - "),
      },
      {
        title: t("vehicle.bodyTypes.title"),
        value: t(`vehicle.bodyTypes.items.${car.bodyType}`),
      },
      {
        title: t("vehicle.sizeClases.title"),
        value: getSafeValue(car.sizeClass),
      },
      {
        title: t("vehicle.numberOfDoors"),
        value: getSafeValue(car.numberOfDoors),
      },
      {
        title: t("vehicle.generalCharacteristics.numberOfSeats"),
        value: getSafeValue(car.numberOfSeats),
      },
      {
        title: t("vehicle.powerSteerings.title"),
        value: getSafeValue(
          car.powerSteering,
          t(`vehicle.powerSteerings.items.${car.powerSteering}`)
        ),
      },
      {
        title: t("vehicle.enginePlacements.title"),
        value: getSafeValue(
          car.enginePlacement,
          t(`vehicle.enginePlacements.items.${car.enginePlacement}`)
        ),
      },
      {
        title: t("vehicle.discDiameter"),
        value: getSafeValue(car.discDiameter),
      },
    ],
  };
}

export function getDimensionsBlock(car: Vehicle, t: Composer["t"]): InfoBlock {
  return {
    title: t("vehicle.generalCharacteristics.dimensions.title"),
    items: [
      {
        title: t("vehicle.generalCharacteristics.dimensions.l"),
        value: getSafeValue(car.dimensionL),
      },

      {
        title: t("vehicle.generalCharacteristics.dimensions.w"),
        value: getSafeValue(car.dimensionW),
      },
      {
        title: t("vehicle.generalCharacteristics.dimensions.h"),
        value: getSafeValue(car.dimensionH),
      },
      {
        title: t("vehicle.generalCharacteristics.wheelbase"),
        value: getSafeValue(car.wheelbase),
      },
      {
        title: t("vehicle.generalCharacteristics.clearance"),
        value: getSafeValue(car.clearance),
      },
    ],
  };
}

export function getWeightsAndVolumesBlock(
  car: Vehicle,
  t: Composer["t"]
): InfoBlock {
  return {
    title: t("vehicle.generalCharacteristics.weightsNVolumes"),
    items: [
      {
        title: t("vehicle.generalCharacteristics.curbWeight"),
        value: getSafeValue(car.curbWeight),
      },
      {
        title: t("vehicle.generalCharacteristics.fullWeight"),
        value: getSafeValue(car.fullWeight),
      },
      {
        title: t("vehicle.generalCharacteristics.gasTankVolume"),
        value: getSafeValue(car.gasTankVolume),
      },
      {
        title: t("vehicle.generalCharacteristics.trunkVolume"),
        value: getSafeValue(car.trunkVolume),
      },
    ],
  };
}

export function getPetrolEngineBlock(
  engine: Engine,
  t: Composer["t"]
): InfoBlock {
  const powerRpms = [
    ...new Set([engine?.powerRPMfrom, engine?.powerRPMto]),
  ].filter(Boolean);
  const torqueRpms = [
    ...new Set([engine?.torqueRPMfrom, engine?.torqueRPMto]),
  ].filter(Boolean);

  const turboFields: InfoBlock["items"] = engine.isTurbo
    ? [
        {
          title: t("vehicle.engine.turbineQuantity"),
          value: getSafeValue(engine.turbo.turboTurbineQuantity),
        },

        {
          title: t("vehicle.engine.turboType"),
          value: getSafeValue(
            engine.turbo.turboType,
            t(`vehicle.engine.turboTypes.${engine.turbo.turboType}`)
          ),
        },
      ]
    : [];

  const hybridFields: InfoBlock["items"] = [];

  if (engine.isHybrid) {
    hybridFields.push(
      {
        title: t("vehicle.engine.hybridElectricPower") + ", кВт",
        value: getSafeValue(engine.hybrid.hybridElectricPower),
      },
      {
        title: t("vehicle.engine.hybridElectricTorque") + ", Нм",
        value: getSafeValue(engine.hybrid.hybridElectricTorque),
      },
      {
        title: t("vehicle.engine.hybridTotalPower") + ", к.с.",
        value: getSafeValue(engine.hybrid.hybridTotalPower),
      },
      {
        title: t("vehicle.engine.hybridRechargeable"),
        value: engine.hybrid.hybridRechargeable ? "+" : "-",
      }
    );
  }

  return {
    title: t("vehicle.engine.title"),
    defaultOpen: true,
    items: [
      {
        title: t("vehicle.engine.fuelType"),
        value: getSafeValue(
          engine?.fuelType,
          t(`vehicle.engine.fuelTypes.${engine?.fuelType}`)
        ),
      },
      {
        title: t("vehicle.engine.displacement"),
        value: getSafeValue(engine?.displacement),
      },
      {
        title: t("vehicle.engine.pistonsQuantity"),
        value: getSafeValue(engine?.pistons),
      },
      {
        title: t("vehicle.engine.numberOfValves"),
        value: getSafeValue(engine?.numberOfValves),
      },
      {
        title: t("vehicle.engine.pistonsPlacement"),
        value: getSafeValue(
          engine?.pistonsPlacement,
          t(`vehicle.engine.pistonsPlacements.${engine?.pistonsPlacement}`)
        ),
      },
      {
        title: t("vehicle.engine.injectionType"),
        value: getSafeValue(
          engine?.injection,
          t(`vehicle.engine.injectionTypes.${engine?.injection}`)
        ),
      },
      ...turboFields,
      {
        title: t("vehicle.engine.power"),
        value: getSafeValue(
          engine?.power,
          `${engine?.power}${
            powerRpms.length ? ` (при ${powerRpms.join(" - ")} об./хв)` : ""
          }`
        ),
      },
      {
        title: t("vehicle.engine.torque"),
        value: getSafeValue(
          engine?.torque,
          `${engine?.torque}${
            torqueRpms.length ? ` (при ${powerRpms.join(" - ")} об./хв)` : ""
          }`
        ),
      },
      ...hybridFields,
      {
        title: t("tradename"),
        value: getSafeValue(engine?.tradename),
      },
    ],
  };
}

export function getElectricEngineBlock(
  engine: Engine,
  t: Composer["t"]
): InfoBlock {
  return {
    title: t("vehicle.engine.title"),
    defaultOpen: true,
    items: [
      {
        title: t("vehicle.engine.fuelType"),
        value: t("vehicle.engine.electric"),
      },
      {
        title: t("vehicle.engine.power"),
        value: getSafeValue(engine?.power),
      },
      {
        title: t("vehicle.engine.torque"),
        value: getSafeValue(engine?.torque),
      },
      {
        title: t("vehicle.engine.electricBatteryCapacity"),
        value: getSafeValue(engine?.electric?.electricBatteryCapacity),
      },
      {
        title: `${t("vehicle.engine.electricDistanceReserve")}, км.`,
        value: getSafeValue(
          engine?.electric?.electricDistanceReserve,
          `${engine?.electric?.electricDistanceReserve}`
        ),
      },
      {
        title: t("vehicle.engine.electricBatteryType"),
        value: getSafeValue(engine?.electric.electricBatteryType),
      },
      {
        title: t("vehicle.engine.electricChargerType"),
        value: getSafeValue(engine?.electric.electricChargerType),
      },
      {
        title: t("vehicle.engine.electricRegularChargerChargeTime"),
        value: getSafeValue(engine?.electric.electricRegularChargerChargeTime),
      },
      {
        title: t("vehicle.engine.electricSuperChargerChargeTime"),
        value: getSafeValue(engine?.electric.electricSuperChargerChargeTime),
      },
      {
        title: t("vehicle.engine.electricEnginesQuantity"),
        value: getSafeValue(engine?.electric.electricEnginesQuantity),
      },
      {
        title: t("vehicle.engine.electricEnginesPLacement"),
        value: getSafeValue(engine?.electric.electricEnginesPlacement),
      },
    ],
  };
}

export function getTransmissionBlock(
  transmission: Transmission,
  t: Composer["t"]
): InfoBlock {
  const gerboxType = [
    transmission.gearbox.type
      ? t(`vehicle.transmission.gearbox.types.${transmission.gearbox.type}`)
      : null,
    transmission.gearbox.technology,
    transmission.gearbox.subType
      ? t(
          `vehicle.transmission.gearbox.subTypes.${transmission.gearbox.subType}`
        )
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const frontSuspension = [
    transmission.suspensionTypeFront
      ? t(
          `vehicle.transmission.suspensions.allTypes.${transmission.suspensionTypeFront}`
        )
      : null,
    transmission.suspensionWorkItemFront
      ? t(
          `vehicle.transmission.suspensions.workItems.${transmission.suspensionWorkItemFront}`
        )
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const rearSuspension = [
    transmission.suspensionTypeRear
      ? t(
          `vehicle.transmission.suspensions.allTypes.${transmission.suspensionTypeRear}`
        )
      : null,
    transmission.suspensionWorkItemRear
      ? t(
          `vehicle.transmission.suspensions.workItems.${transmission.suspensionWorkItemRear}`
        )
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const braks = [
    ...new Set([
      transmission.brakingSystemTypeFront,
      transmission.brakingSystemTypeRear,
    ]),
  ]
    .filter(Boolean)
    .map((b) => t(`vehicle.transmission.brakingSystemTypes.${b}`))
    .join(", ");

  return {
    title: t("vehicle.transmission.title"),
    items: [
      {
        title: t("vehicle.transmission.drive"),
        value: getSafeValue(
          transmission.drive,
          [
            t(`vehicle.transmission.driveType.${transmission.drive}`),
            transmission.driveName,
          ]
            .filter(Boolean)
            .join(", ")
        ),
      },
      {
        title: t("vehicle.transmission.gearbox.type"),
        value: getSafeValue(transmission.gearbox?.type, gerboxType),
      },
      {
        title: t("vehicle.transmission.gearbox.numberOfGears"),
        value: getSafeValue(transmission.gearbox?.numberOfGears),
      },
      {
        title: t("manufacturer"),
        value: getSafeValue(transmission.gearbox.made),
      },
      {
        title: t("vehicle.transmission.suspensionTypeFront"),
        value: getSafeValue(frontSuspension),
      },
      {
        title: t("vehicle.transmission.suspensionTypeRear"),
        value: getSafeValue(rearSuspension),
      },
      {
        title: "Гальма",
        value: getSafeValue(braks),
      },
    ],
  };
}
