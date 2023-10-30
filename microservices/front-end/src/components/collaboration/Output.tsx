interface OutputProps {
  stdout: string;
  stderr: string;
}

function Output({ stdout, stderr }: OutputProps) {
  return (
    <div>
      {stdout}
      {stderr}
    </div>
  );
}

export default Output;
