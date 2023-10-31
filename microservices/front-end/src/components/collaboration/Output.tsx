import classes from "./CollaborationPage.module.css";

interface OutputProps {
  stdout: string;
}

function Output({ stdout }: OutputProps) {
  return (
    <>
      <h3>Output</h3>
      <pre className={classes.output_box}>{stdout}</pre>
    </>
  );
}

export default Output;
