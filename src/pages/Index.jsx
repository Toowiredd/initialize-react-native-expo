import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';
import { Button } from "@/components/ui/button";

const Index = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Redux Counter Example</h1>
      <div className="flex justify-center items-center space-x-4">
        <Button onClick={() => dispatch(decrement())}>-</Button>
        <span className="text-2xl">{count}</span>
        <Button onClick={() => dispatch(increment())}>+</Button>
      </div>
    </div>
  );
};

export default Index;