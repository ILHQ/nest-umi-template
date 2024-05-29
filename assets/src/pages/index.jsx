import styles from './index.less';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <img
        src={require('@public/texture.jpg')}
        width={200}
        height={200}
        alt=""
      />
      <div className={styles.img}></div>
    </div>
  );
}
