import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

interface InputSpinnerProps {
  min: number;
  max: number;
  increment: number;
  value: number;
  decimal_places: number;
  onChange: (value: number) => void;
}
// react bootstrap right button
export default function InputSpinner(props: InputSpinnerProps) {
  function increment() {
    props.onChange(Math.min(props.max, props.value + props.increment));
  }
  function decrement() {
    props.onChange(Math.max(props.min, props.value - props.increment));
  }
  return (
    <>
      <Button variant="outline-secondary" onClick={decrement}>
        -
      </Button>
      <FormControl
        type="text"
        value={props.value.toFixed(props.decimal_places)}
      />

      <Button variant="outline-secondary" onClick={increment}>
        +
      </Button>
    </>
  );
}
