import React, {useState} from "react";
import {InputProps} from "../../types";
import {convertMinutesToDuration} from "../../utils/helper";

/**
 * Select component
 *
 * @param name string
 * @param label string
 * @param error any
 * @param rest Record<string, any>
 * @constructor
 *
 * @return JSX.Element
 */
const Duration: React.FC<InputProps> = ({name, label, error, ...rest}: InputProps): JSX.Element => {
    const minutesVal: number = parseInt(rest.value) || 0;
    const duration: number[] = convertMinutesToDuration(minutesVal);
    const [value, setValue] = useState(duration);
    const hourMinutes: number = 60;

    const onChangeHours = (hours: string): void => {
        const newMinutes: number = parseInt(hours) * hourMinutes + value[1];
        setValue(convertMinutesToDuration(newMinutes));
        if (rest.onChange) {
            rest.onChange({currentTarget: {name: name, value: newMinutes}});
        }
    }

    const onChangeMinutes = (minutes: string): void => {
        const newMinutes: number = value[0] * hourMinutes + parseInt(minutes);
        setValue(convertMinutesToDuration(newMinutes));
        if (rest.onChange) {
            rest.onChange({currentTarget: {name: name, value: newMinutes}});
        }
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <div>
                <select {...rest} name={`${name}-hours`} id={`${name}-hours`} data-testid={`${name}-hours-select`}
                        className={"form-control w-auto d-inline-block" + (error ? " is-invalid" : "")}
                        value={value[0]}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChangeHours(event.currentTarget.value)}>
                    {Array.from(Array(10).keys()).map((hour: number) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                <span className="ml-1">Hours</span>
                <select {...rest} name={`${name}-minutes`} id={`${name}-minutes`} data-testid={`${name}-minutes-select`}
                        className={"form-control w-auto d-inline-block ml-2" + (error ? " is-invalid" : "")}
                        value={value[1]}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChangeMinutes(event.currentTarget.value)}>
                    {Array.from(Array(60).keys()).map((minute: number) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
                <span className="ml-1">Minutes</span>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Duration;
